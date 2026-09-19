import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const colleges = [
  'AISSMS College of Engineering, Pune',
  'COEP Technological University, Pune',
  'PICT Pune',
  'MIT World Peace University',
  'VJTI Mumbai',
  'IIT Bombay',
  'BITS Pilani',
  'VIT Pune',
  'Cummins College of Engineering',
  'Sinhgad College of Engineering',
  'PCCOE Pune',
  'DY Patil College of Engineering',
];

const fighters = [
  'Scorpion',
  'Sub-Zero',
  'Raiden',
  'Liu Kang',
  'Noob Saibot',
  'Shang Tsung',
  'Johnny Cage',
  'Sonya Blade',
  'Baraka',
  'Fujin',
];

async function main() {
  console.log('Seeding 21st Engineering Today-2026: Console Conquest tournament database...');

  // 1. Settings from Official Rule Book
  const defaultSettings = [
    { key: 'MAX_SLOTS', value: '128' },
    { key: 'REGISTRATION_OPEN', value: 'true' },
    { key: 'WAITLIST_ENABLED', value: 'true' },
    { key: 'EVENT_NAME', value: 'Console Conquest' },
    { key: 'GAME_NAME', value: 'Mortal Kombat 11' },
    { key: 'MATCH_FORMAT', value: 'R32-SF Bo1 • Group Finals Bo3 • Semis Bo3 • Grand Final Bo5' },
    { key: 'ENTRY_FEE', value: 'Rs 100 per participant' },
    { key: 'VENUE', value: 'Room No. 340, AISSMS COE' },
    { key: 'DATES', value: '29th & 30th September 2026, 9:00 am onwards' },
  ];

  for (const s of defaultSettings) {
    await prisma.tournamentSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }

  // 2. Admin User
  const adminPasswordHash = await bcrypt.hash('kombat2026!', 10);
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: { passwordHash: adminPasswordHash },
    create: {
      username: 'admin',
      passwordHash: adminPasswordHash,
      role: 'SUPERADMIN',
    },
  });

  // 3. Clear existing matches & participants for fresh full tournament setup
  await prisma.match.deleteMany();
  await prisma.participant.deleteMany();

  // 4. Seed 96 active participants across Pool A (32), Pool B (32), Pool C (32).
  // Pool D (Slots 97-128) has 32 open slots left for incoming challengers!
  console.log('Generating 96 seeded challengers across Pools A, B, and C...');

  const firstNames = [
    'Arjun', 'Rohan', 'Dev', 'Siddharth', 'Aditya', 'Kabir', 'Yash', 'Varun',
    'Karan', 'Ananya', 'Pranav', 'Tanmay', 'Rishi', 'Harsh', 'Aakash', 'Sameer',
    'Lokesh', 'Nikhil', 'Pooja', 'Vikram', 'Gaurav', 'Manish', 'Chaitanya', 'Sanket',
    'Omkar', 'Atharva', 'Sahil', 'Kunal', 'Tejas', 'Shubham', 'Vedant', 'Chinmay',
  ];

  const lastNames = [
    'Verma', 'Mehta', 'Patel', 'Rao', 'Sharma', 'Singhania', 'Roy', 'Nair',
    'Malhotra', 'Deshmukh', 'Kulkarni', 'Bhatt', 'Sen', 'Vardhan', 'Gupta', 'Khan',
    'Joshi', 'Rane', 'Hegde', 'Aditya', 'Dubey', 'Pandey', 'Reddy', 'Shinde',
    'Bhosale', 'Jadhav', 'Kadam', 'Pawar', 'More', 'Chavan', 'Sawant', 'Patil',
  ];

  for (let slot = 1; slot <= 96; slot++) {
    const fn = firstNames[(slot - 1) % firstNames.length];
    const ln = lastNames[(slot * 3) % lastNames.length];
    const fullName = `${fn} ${ln}`;
    const tag = `${fn}Kombat${(slot * 7) % 99 + 1}`;
    const fighter = fighters[slot % fighters.length];
    const college = colleges[slot % colleges.length];
    const pool = slot <= 32 ? 'A' : slot <= 64 ? 'B' : 'C';

    const paddedSlot = String(slot).padStart(4, '0');
    const registrationId = `CC-2026-${paddedSlot}`;
    const rollNumber = `ET26-${pool}${String(slot).padStart(3, '0')}`;
    const phone = `98${String(slot).padStart(8, '0')}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${slot}@aissms.ac.in`;

    await prisma.participant.create({
      data: {
        registrationId,
        slotNumber: slot,
        pool,
        fullName,
        college,
        rollNumber,
        email,
        phone,
        gamerTag: tag,
        preferredFighter: fighter,
        age: 20,
        status: slot <= 40 ? 'CHECKED-IN' : 'REGISTERED',
        checkedInAt: slot <= 40 ? new Date() : null,
      },
    });
  }

  // 5. Generate Round 1 bracket matches for each of the 4 pools (A, B, C, D)
  // Each pool of 32 has 16 matches in Round 1
  const pools = ['A', 'B', 'C', 'D'];
  for (let pIdx = 0; pIdx < pools.length; pIdx++) {
    const poolName = pools[pIdx];
    const poolStartSlot = pIdx * 32 + 1;

    for (let m = 1; m <= 16; m++) {
      const s1 = poolStartSlot + (m - 1);
      const s2 = poolStartSlot + (32 - m); // Seed 1 vs 32 within pool

      const p1 = await prisma.participant.findUnique({ where: { slotNumber: s1 } });
      const p2 = await prisma.participant.findUnique({ where: { slotNumber: s2 } });

      await prisma.match.create({
        data: {
          pool: poolName,
          round: 1,
          matchNumber: m,
          player1Slot: s1,
          player2Slot: s2 <= 96 ? s2 : null, // Pool D players have open slots
          player1Name: p1 ? p1.fullName : `Slot #${s1}`,
          player2Name: p2 ? p2.fullName : (s2 <= 96 ? `Slot #${s2}` : 'TBD (Open Challenger Slot)'),
          player1Tag: p1?.gamerTag,
          player2Tag: p2?.gamerTag,
          player1Fighter: p1?.preferredFighter,
          player2Fighter: p2?.preferredFighter,
          score1: 0,
          score2: 0,
          status: 'SCHEDULED',
        },
      });
    }
  }

  // 6. Generate Championship Finals Matches (Semifinal 1: Winner A vs Winner B; Semifinal 2: Winner C vs Winner D; Grand Final; 3rd-Place)
  await prisma.match.create({
    data: {
      pool: 'FINALS',
      round: 1, // Semifinals
      matchNumber: 1,
      player1Name: 'Winner Group A',
      player2Name: 'Winner Group B',
      score1: 0,
      score2: 0,
      status: 'SCHEDULED',
    },
  });

  await prisma.match.create({
    data: {
      pool: 'FINALS',
      round: 1, // Semifinals
      matchNumber: 2,
      player1Name: 'Winner Group C',
      player2Name: 'Winner Group D',
      score1: 0,
      score2: 0,
      status: 'SCHEDULED',
    },
  });

  await prisma.match.create({
    data: {
      pool: 'FINALS',
      round: 2, // 3rd Place Match
      matchNumber: 1,
      player1Name: 'Loser Semifinal 1',
      player2Name: 'Loser Semifinal 2',
      score1: 0,
      score2: 0,
      status: 'SCHEDULED',
    },
  });

  await prisma.match.create({
    data: {
      pool: 'FINALS',
      round: 2, // Grand Final
      matchNumber: 2,
      player1Name: 'Winner Semifinal 1',
      player2Name: 'Winner Semifinal 2',
      score1: 0,
      score2: 0,
      status: 'SCHEDULED',
    },
  });

  console.log('\n✔ Official ET-2026 Console Conquest Database successfully seeded!');
  console.log('- Total Capacity: 128 Contenders');
  console.log('- 96 Players registered in Pools A, B, C (Slots 001 - 096)');
  console.log('- 32 Open Slots in Pool D (Slots 097 - 128)');
  console.log('- 68 Matches generated across 4 Pools + Championship Stage');
  console.log('- Admin Login: admin / kombat2026!\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
