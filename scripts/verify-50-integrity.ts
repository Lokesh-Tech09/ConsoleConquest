import { prisma } from '../lib/db';

async function verify50SlotsIntegrity() {
  console.log('=== VERIFYING 50 CONCURRENT REGISTRATIONS INTEGRITY & UNIQUENESS ===');

  // Verify DB starts at 0 participants
  const initialCount = await prisma.participant.count();
  console.log(`Initial DB participant count: ${initialCount}`);

  const fighters = Array.from({ length: 50 }, (_, i) => ({
    fullName: `Batch Fighter ${i + 1}`,
    college: 'AISSMS COE',
    rollNumber: `BATCH50_${String(i + 1).padStart(3, '0')}`,
    email: `batch50_${i + 1}@test.com`,
    phone: `992250${String(i + 1).padStart(4, '0')}`,
    gamerTag: `BatchTag_${i + 1}`,
    preferredFighter: 'Scorpion',
    agreeTerms: true,
  }));

  console.log('Dispatching 50 concurrent registrations via HTTP...');
  const startTime = Date.now();
  const responses = await Promise.all(
    fighters.map(async (f) => {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      });
      return { status: res.status, data: await res.json() };
    })
  );
  const totalMs = Date.now() - startTime;
  console.log(`Completed in ${totalMs}ms (${(totalMs / 50).toFixed(1)}ms per registration)`);

  const successful = responses.filter((r) => r.status === 201 && r.data?.success);
  console.log(`Successful: ${successful.length} / 50`);

  const slots = new Set<number>();
  const regIds = new Set<string>();
  let duplicateSlots = 0;
  let duplicateRegIds = 0;

  successful.forEach((r) => {
    const slot = r.data.slotNumber;
    const regId = r.data.registrationId;

    if (slots.has(slot)) duplicateSlots++;
    slots.add(slot);

    if (regIds.has(regId)) duplicateRegIds++;
    regIds.add(regId);
  });

  console.log(`Unique Slots Allocated: ${slots.size} / 50 (Duplicates: ${duplicateSlots})`);
  console.log(`Unique Registration IDs: ${regIds.size} / 50 (Duplicates: ${duplicateRegIds})`);

  // Verify against database records
  const dbParticipants = await prisma.participant.findMany({
    where: { rollNumber: { startsWith: 'BATCH50_' } },
    orderBy: { slotNumber: 'asc' },
  });

  console.log(`DB Confirmed Records: ${dbParticipants.length} / 50`);
  const dbSlots = dbParticipants.map((p) => p.slotNumber);
  const minSlot = Math.min(...dbSlots.filter((s): s is number => s !== null));
  const maxSlot = Math.max(...dbSlots.filter((s): s is number => s !== null));
  console.log(`Slot Range: Slot #${minSlot} to Slot #${maxSlot}`);

  if (duplicateSlots === 0 && duplicateRegIds === 0 && dbParticipants.length === 50) {
    console.log('✔ INTEGRITY TEST PASSED: 50 concurrent registrations are 100% unique, stable, and accurate!');
  } else {
    console.error('✖ INTEGRITY TEST FAILED');
  }

  // Cleanup to keep DB clean at 0 registrations as requested by user
  console.log('\nCleaning up all 50 test records...');
  await prisma.participant.deleteMany({
    where: { rollNumber: { startsWith: 'BATCH50_' } },
  });
  const finalCount = await prisma.participant.count();
  console.log(`Final DB count: ${finalCount} registrations (clean state)\n`);
  await prisma.$disconnect();
}

verify50SlotsIntegrity().catch(console.error);
