async function testLiveBracketUpdate() {
  console.log('Registering a test fighter to test live bracket reflection...');
  const regRes = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Vikramaditya Rao',
      college: 'AISSMS COE',
      rollNumber: 'BRACKET_TEST_01',
      email: 'vikram.bracket@test.com',
      phone: '9888770001',
      gamerTag: 'ViperStrike',
      preferredFighter: 'Sub-Zero',
      agreeTerms: true,
    }),
  });

  const regData = await regRes.json();
  console.log('Registration Response:', regData);

  console.log('Fetching bracket to verify fighter presence...');
  const bracketRes = await fetch('http://localhost:3000/api/bracket?pool=A');
  const bracketData = await bracketRes.json();
  const poolAMatches = bracketData.byPool?.A?.[1] || [];
  const match1 = poolAMatches[0];

  console.log('Pool A Round 1 Match #1:');
  console.log('Player 1 Slot:', match1?.player1Slot, '| Name:', match1?.player1Name, '| Tag:', match1?.player1Tag, '| Fighter:', match1?.player1Fighter);
  console.log('Player 2 Slot:', match1?.player2Slot, '| Name:', match1?.player2Name);

  // Clean up
  const { prisma } = await import('../lib/db');
  await prisma.participant.deleteMany({
    where: { rollNumber: 'BRACKET_TEST_01' },
  });
  console.log('Test participant cleaned up. DB is back to clean state.');
  await prisma.$disconnect();
}

testLiveBracketUpdate().catch(console.error);
