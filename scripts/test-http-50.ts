import { prisma } from '../lib/db';

async function testHttp50Concurrent() {
  console.log('Testing 50 concurrent HTTP requests to http://localhost:3000/api/register...');
  const fighters = Array.from({ length: 50 }, (_, i) => ({
    fullName: `Http Fighter ${i + 1}`,
    college: 'AISSMS COE',
    rollNumber: `HTTP50_${String(i + 1).padStart(3, '0')}`,
    email: `httpfighter50_${i + 1}@test.com`,
    phone: `991150${String(i + 1).padStart(4, '0')}`,
    gamerTag: `HttpGamer_${i + 1}`,
    preferredFighter: 'Raiden',
    agreeTerms: true,
  }));

  const startTime = Date.now();
  const responses = await Promise.all(
    fighters.map(async (f) => {
      try {
        const res = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(f),
        });
        const status = res.status;
        const data = await res.json();
        return { status, data };
      } catch (err: any) {
        return { status: 500, error: err.message };
      }
    })
  );
  const duration = Date.now() - startTime;

  const successful = responses.filter((r) => r.status === 201 && r.data?.success);
  const rateLimited = responses.filter((r) => r.status === 429);
  const failed = responses.filter((r) => r.status !== 201 && r.status !== 429);

  console.log(`HTTP 50 concurrent completed in ${duration}ms`);
  console.log(`Status 201 Success: ${successful.length} / 50`);
  console.log(`Status 429 Rate limited: ${rateLimited.length} / 50`);
  console.log(`Other failures: ${failed.length} / 50`);

  if (rateLimited.length > 0) {
    console.log('Sample 429 error:', rateLimited[0]);
  }
  if (failed.length > 0) {
    console.log('Sample failed error:', failed[0]);
  }

  // Cleanup
  console.log('Cleaning up HTTP test data...');
  await prisma.participant.deleteMany({
    where: { rollNumber: { startsWith: 'HTTP50_' } },
  });
  console.log('Cleanup complete.');
  await prisma.$disconnect();
}

testHttp50Concurrent().catch(console.error);
