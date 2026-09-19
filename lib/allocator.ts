import { prisma } from './db';
import { RegistrationInput } from './types';
import { normalizePhone, validateRegistrationInput } from './validation';
import { EVENT_CONFIG } from './config';

// High-performance FIFO AsyncMutex lock for serialized slot allocation
class AsyncMutex {
  private queue: Array<() => void> = [];
  private locked = false;

  lock(): Promise<() => void> {
    return new Promise((resolve) => {
      const execute = () => {
        let released = false;
        resolve(() => {
          if (released) return;
          released = true;
          if (this.queue.length > 0) {
            const next = this.queue.shift()!;
            next();
          } else {
            this.locked = false;
          }
        });
      };

      if (!this.locked) {
        this.locked = true;
        execute();
      } else {
        this.queue.push(execute);
      }
    });
  }
}

const slotAllocationMutex = new AsyncMutex();

export interface AllocationResult {
  success: boolean;
  registrationId?: string;
  slotNumber?: number | null;
  pool?: string | null;
  status?: string;
  waitlistPosition?: number | null;
  error?: string;
  field?: string;
}

export function calculatePoolFromSlot(slot: number | null, maxSlots = 128): string | null {
  if (!slot || slot < 1) return null;
  const poolSize = Math.ceil(maxSlots / 4);
  if (slot <= poolSize) return 'A';
  if (slot <= poolSize * 2) return 'B';
  if (slot <= poolSize * 3) return 'C';
  return 'D';
}

let cachedSettings: {
  maxSlots: number;
  registrationOpen: boolean;
  waitlistEnabled: boolean;
  expiresAt: number;
} | null = null;

export async function getTournamentSettings(): Promise<{
  maxSlots: number;
  registrationOpen: boolean;
  waitlistEnabled: boolean;
}> {
  const now = Date.now();
  if (cachedSettings && cachedSettings.expiresAt > now) {
    return {
      maxSlots: cachedSettings.maxSlots,
      registrationOpen: cachedSettings.registrationOpen,
      waitlistEnabled: cachedSettings.waitlistEnabled,
    };
  }

  try {
    const settings = await prisma.tournamentSetting.findMany();
    const map = new Map(settings.map((s) => [s.key, s.value]));

    const maxSlots = parseInt(map.get('MAX_SLOTS') || String(EVENT_CONFIG.DEFAULT_MAX_SLOTS), 10);
    const registrationOpen = map.get('REGISTRATION_OPEN') !== 'false';
    const waitlistEnabled = map.get('WAITLIST_ENABLED') !== 'false';

    cachedSettings = {
      maxSlots,
      registrationOpen,
      waitlistEnabled,
      expiresAt: now + 2000, // 2-second in-memory cache for high concurrency bursts
    };

    return { maxSlots, registrationOpen, waitlistEnabled };
  } catch {
    return {
      maxSlots: EVENT_CONFIG.DEFAULT_MAX_SLOTS,
      registrationOpen: true,
      waitlistEnabled: true,
    };
  }
}

export async function registerParticipant(input: RegistrationInput): Promise<AllocationResult> {
  // 1. Validate form fields
  const validation = validateRegistrationInput(input);
  if (!validation.isValid) {
    const firstField = Object.keys(validation.errors)[0];
    return {
      success: false,
      error: validation.errors[firstField],
      field: firstField,
    };
  }

  const cleanPhone = normalizePhone(input.phone);
  const cleanEmail = input.email.trim().toLowerCase();
  const cleanRoll = input.rollNumber.trim().toUpperCase();
  const cleanFullName = input.fullName.trim();
  const cleanGamerTag = input.gamerTag.trim();

  // 2. Acquire concurrency mutex lock
  const unlock = await slotAllocationMutex.lock();

  try {
    // 3. Check duplicate records
    const existingParticipant = await prisma.participant.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { phone: cleanPhone },
          { rollNumber: cleanRoll },
        ],
      },
    });

    if (existingParticipant) {
      if (existingParticipant.email.toLowerCase() === cleanEmail) {
        return {
          success: false,
          error: `Email "${cleanEmail}" is already registered. Registration ID: ${existingParticipant.registrationId}`,
          field: 'email',
        };
      }
      if (existingParticipant.phone === cleanPhone) {
        return {
          success: false,
          error: `Phone number is already registered under Registration ID: ${existingParticipant.registrationId}`,
          field: 'phone',
        };
      }
      if (existingParticipant.rollNumber.toUpperCase() === cleanRoll) {
        return {
          success: false,
          error: `Student ID / Roll Number "${cleanRoll}" is already registered.`,
          field: 'rollNumber',
        };
      }
    }

    // 4. Check tournament capacity and state
    const { maxSlots, registrationOpen, waitlistEnabled } = await getTournamentSettings();

    if (!registrationOpen) {
      return {
        success: false,
        error: 'Tournament registration is currently closed by the organizers.',
      };
    }

    // 5. Query currently occupied slots
    const registeredParticipants = await prisma.participant.findMany({
      where: {
        slotNumber: { not: null },
        status: { in: ['REGISTERED', 'CHECKED-IN', 'PLAYING', 'ADVANCED'] },
      },
      select: { slotNumber: true },
      orderBy: { slotNumber: 'asc' },
    });

    const occupiedSlots = new Set(registeredParticipants.map((p) => p.slotNumber as number));

    // Find the next available slot between 1 and maxSlots (up to 128)
    let assignedSlot: number | null = null;
    for (let s = 1; s <= maxSlots; s++) {
      if (!occupiedSlots.has(s)) {
        assignedSlot = s;
        break;
      }
    }

    let status = 'REGISTERED';
    let waitlistPosition: number | null = null;

    if (assignedSlot === null) {
      // Tournament capacity reached
      if (!waitlistEnabled) {
        return {
          success: false,
          error: `Tournament capacity of ${maxSlots} slots has been reached, and waitlist is currently disabled.`,
        };
      }

      // Calculate next waitlist position
      const waitlistCount = await prisma.participant.count({
        where: { status: 'WAITLISTED' },
      });
      waitlistPosition = waitlistCount + 1;
      status = 'WAITLISTED';
    }

    const assignedPool = calculatePoolFromSlot(assignedSlot, maxSlots);

    // 6. Generate sequential Registration ID: CC-2026-XXXX (O(1) lookup)
    const latestParticipant = await prisma.participant.findFirst({
      where: { registrationId: { startsWith: 'CC-2026-' } },
      orderBy: { createdAt: 'desc' },
      select: { registrationId: true },
    });

    let nextSeq = 1;
    if (latestParticipant) {
      const match = latestParticipant.registrationId.match(/CC-2026-(\d+)/);
      if (match) {
        nextSeq = parseInt(match[1], 10) + 1;
      }
    }
    const totalRegistrations = await prisma.participant.count();
    if (totalRegistrations >= nextSeq) {
      nextSeq = totalRegistrations + 1;
    }
    const registrationId = `CC-2026-${String(nextSeq).padStart(4, '0')}`;

    // 7. Create participant in atomic transaction
    const newParticipant = await prisma.participant.create({
      data: {
        registrationId,
        slotNumber: assignedSlot,
        pool: assignedPool,
        fullName: cleanFullName,
        college: input.college.trim(),
        rollNumber: cleanRoll,
        email: cleanEmail,
        phone: cleanPhone,
        gamerTag: cleanGamerTag,
        preferredFighter: input.preferredFighter || 'Scorpion',
        age: input.age ? Number(input.age) : null,
        status,
        waitlistPosition,
      },
    });

    return {
      success: true,
      registrationId: newParticipant.registrationId,
      slotNumber: newParticipant.slotNumber,
      pool: newParticipant.pool,
      status: newParticipant.status,
      waitlistPosition: newParticipant.waitlistPosition,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Database transaction failed';
    return {
      success: false,
      error: `Registration failed: ${errorMsg}`,
    };
  } finally {
    unlock();
  }
}
