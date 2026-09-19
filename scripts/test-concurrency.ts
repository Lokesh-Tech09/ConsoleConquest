import { registerParticipant } from '../lib/allocator';
import { prisma } from '../lib/db';

async function testConcurrentRegistrations() {
  console.log('=== RUNNING CONCURRENT REGISTRATION & SLOT ALLOCATION TEST ===\n');

  // Let's test allocating 5 simultaneous registrations
  const simulatedChallengers = [
    { fullName: 'Concurrent Fighter 1', college: 'IITB', rollNumber: 'CONC01', email: 'conc1@test.com', phone: '9871110001', gamerTag: 'ConcAlpha', agreeTerms: true },
    { fullName: 'Concurrent Fighter 2', college: 'IITD', rollNumber: 'CONC02', email: 'conc2@test.com', phone: '9871110002', gamerTag: 'ConcBeta', agreeTerms: true },
    { fullName: 'Concurrent Fighter 3', college: 'IITM', rollNumber: 'CONC03', email: 'conc3@test.com', phone: '9871110003', gamerTag: 'ConcGamma', agreeTerms: true },
    { fullName: 'Concurrent Fighter 4', college: 'IITK', rollNumber: 'CONC04', email: 'conc4@test.com', phone: '9871110004', gamerTag: 'ConcDelta', agreeTerms: true },
    { fullName: 'Concurrent Fighter 5', college: 'IITR', rollNumber: 'CONC05', email: 'conc5@test.com', phone: '9871110005', gamerTag: 'ConcOmega', agreeTerms: true },
  ];

  console.log(`Firing ${simulatedChallengers.length} simultaneous registrations with Promise.all...`);
  const results = await Promise.all(
    simulatedChallengers.map((c) => registerParticipant(c))
  );

  console.log('\nResults:');
  const allocatedSlots = new Set<number>();
  let hasErrors = false;

  results.forEach((r, idx) => {
    console.log(`[Challenger ${idx + 1}] Success: ${r.success} | RegID: ${r.registrationId} | Slot: ${r.slotNumber} | Status: ${r.status}`);
    if (!r.success) {
      hasErrors = true;
    } else if (r.slotNumber) {
      if (allocatedSlots.has(r.slotNumber)) {
        console.error(`FATAL COLLISION: Slot #${r.slotNumber} was allocated more than once!`);
        hasErrors = true;
      }
      allocatedSlots.add(r.slotNumber);
    }
  });

  if (!hasErrors) {
    console.log(`\n✔ RACE-CONDITION TEST PASSED: All ${allocatedSlots.size} slots are unique and non-overlapping!`);
  } else {
    console.error('\n✖ TEST FAILED');
  }

  // Test Duplicate Rejection
  console.log('\nTesting duplicate rejection on identical email, phone, and roll number...');
  const duplicateResult = await registerParticipant({
    fullName: 'Imposter Challenger',
    college: 'Fake College',
    rollNumber: 'CONC01', // Already registered
    email: 'conc1@test.com', // Already registered
    phone: '9871110001', // Already registered
    gamerTag: 'ImposterTag',
    agreeTerms: true,
  });

  if (!duplicateResult.success && duplicateResult.error?.includes('already registered')) {
    console.log(`✔ DUPLICATE REJECTION PASSED: "${duplicateResult.error}"`);
  } else {
    console.error('✖ DUPLICATE REJECTION FAILED: Duplicate registration was not rejected!');
  }

  // Clean up test records
  console.log('\nCleaning up temporary test records...');
  await prisma.participant.deleteMany({
    where: { rollNumber: { startsWith: 'CONC' } },
  });
  console.log('Cleanup complete.\n');
}

testConcurrentRegistrations()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
