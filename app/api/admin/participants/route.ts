import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';
import { getTournamentSettings } from '@/lib/allocator';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim() || '';
    const statusFilter = searchParams.get('status')?.trim() || '';

    const whereClause: Record<string, unknown> = {};

    if (statusFilter && statusFilter !== 'ALL') {
      whereClause.status = statusFilter;
    }

    if (query) {
      const slotNum = parseInt(query, 10);
      whereClause.OR = [
        { fullName: { contains: query } },
        { email: { contains: query } },
        { phone: { contains: query } },
        { rollNumber: { contains: query } },
        { gamerTag: { contains: query } },
        { registrationId: { contains: query } },
        { college: { contains: query } },
        ...(isNaN(slotNum) ? [] : [{ slotNumber: slotNum }]),
      ];
    }

    const participants = await prisma.participant.findMany({
      where: whereClause,
      orderBy: [
        { slotNumber: 'asc' },
        { waitlistPosition: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    const { maxSlots, registrationOpen, waitlistEnabled } = await getTournamentSettings();

    const registeredCount = await prisma.participant.count({
      where: {
        slotNumber: { not: null },
        status: { in: ['REGISTERED', 'CHECKED-IN', 'PLAYING', 'ADVANCED'] },
      },
    });

    const checkedInCount = await prisma.participant.count({
      where: { status: 'CHECKED-IN' },
    });

    const waitlistCount = await prisma.participant.count({
      where: { status: 'WAITLISTED' },
    });

    const availableSlots = Math.max(0, maxSlots - registeredCount);

    return NextResponse.json({
      success: true,
      participants,
      stats: {
        totalSlots: maxSlots,
        registeredCount,
        availableSlots,
        waitlistCount,
        checkedInCount,
        registrationOpen,
        waitlistEnabled,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to query participants';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
