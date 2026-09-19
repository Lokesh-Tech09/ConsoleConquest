async function testBracket() {
  console.log('Testing GET http://localhost:3000/api/bracket...');
  const res = await fetch('http://localhost:3000/api/bracket');
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Success:', data.success);
  console.log('Total matches returned:', data.matches?.length);
  console.log('Pools in byPool:', Object.keys(data.byPool || {}));
  for (const pool of Object.keys(data.byPool || {})) {
    const rounds = Object.keys(data.byPool[pool]);
    console.log(`Pool ${pool}: Rounds [${rounds.join(', ')}]`);
  }
}

testBracket().catch(console.error);
