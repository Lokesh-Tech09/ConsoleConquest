import { registerParticipant } from '../lib/allocator';
import { prisma } from '../lib/db';

async function test50Concurrent() {
  console.log('Testing 50 concurrent registrations...');
  const fighters = Array.from({ length: 50 }, (_, i) => ({
    fullName: `Test Fighter ${i + 1}`,
    college: 'AISSMS COE',
    rollNumber: `ROLL50_${String(i + 1).padStart(3, '0')}`,
    email: `fighter50_${i + 1}@test.com`,
    phone: `990050${String(i + 1).padStart(4, '0')}`,
    gamerTag: `Gamer_${i + 1}`,
    preferredFighter: 'Sub-Zero',
    agreeTerms: true,
  }));

  const startTime = Date.now();
  const results = await Promise.all(fighters.map((f) => registerParticipant(f)));
  const duration = Date.now() - startTime;

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`Completed in ${duration}ms (${(duration / 50).toFixed(1)}ms/reg avg)`);
  console.log(`Success count: ${successful.length} / 50`);
  console.log(`Failed count: ${failed.length} / 50`);

  if (failed.length > 0) {
    console.error('Sample failure:', failed[0]);
  }

  // Check unique slot allocation
  const slots = new Set<number>();
  let duplicates = 0;
  successful.forEach((r) => {
    if (r.slotNumber) {
      if (slots.has(r.slotNumber)) duplicates++;
      slots.add(r.slotNumber);
    }
  });

  console.log(`Unique slots allocated: ${slots.size}, Duplicates: ${duplicates}`);

  // Cleanup
  console.log('Cleaning up test data...');
  await prisma.participant.deleteMany({
    where: { rollNumber: { startsWith: 'ROLL50_' } },
  });
  console.log('Cleanup complete.');
  await prisma.$disconnect();
}

test50Concurrent().catch(console.error);
