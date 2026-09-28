import { registerParticipant } from '../lib/allocator';
import { prisma } from '../lib/db';

const TEN_CONTENDERS = [
  {
    fullName: 'Kabir Mehta',
    gamerTag: 'ViperKabir',
    email: 'kabir.mehta26@aissms.ac.in',
    phone: '9823011001',
    college: 'AISSMS College of Engineering, Pune',
    rollNumber: 'ET26-AIML-01',
    preferredFighter: 'Scorpion',
    age: 20,
  },
  {
    fullName: 'Ananya Sharma',
    gamerTag: 'FrostByte',
    email: 'ananya.sharma26@coep.ac.in',
    phone: '9823011002',
    college: 'COEP Technological University, Pune',
    rollNumber: 'ET26-COMP-02',
    preferredFighter: 'Sub-Zero',
    age: 21,
  },
  {
    fullName: 'Siddharth Rao',
    gamerTag: 'ThunderGod',
    email: 'siddharth.rao26@pict.edu',
    phone: '9823011003',
    college: 'PICT Pune',
    rollNumber: 'ET26-IT-03',
    preferredFighter: 'Raiden',
    age: 19,
  },
  {
    fullName: 'Devika Patel',
    gamerTag: 'FireDragon',
    email: 'devika.patel26@mitwpu.edu.in',
    phone: '9823011004',
    college: 'MIT World Peace University',
    rollNumber: 'ET26-ENTC-04',
    preferredFighter: 'Liu Kang',
    age: 20,
  },
  {
    fullName: 'Rohan Deshmukh',
    gamerTag: 'ShadowKing',
    email: 'rohan.deshmukh26@vit.edu',
    phone: '9823011005',
    college: 'VIT Pune',
    rollNumber: 'ET26-CS-05',
    preferredFighter: 'Noob Saibot',
    age: 22,
  },
  {
    fullName: 'Tanya Kulkarni',
    gamerTag: 'SoulStealer',
    email: 'tanya.kulkarni26@cummins.in',
    phone: '9823011006',
    college: 'Cummins College of Engineering',
    rollNumber: 'ET26-MECH-06',
    preferredFighter: 'Shang Tsung',
    age: 20,
  },
  {
    fullName: 'Yash Malhotra',
    gamerTag: 'CageMatch',
    email: 'yash.malhotra26@vjti.ac.in',
    phone: '9823011007',
    college: 'VJTI Mumbai',
    rollNumber: 'ET26-CIVIL-07',
    preferredFighter: 'Johnny Cage',
    age: 21,
  },
  {
    fullName: 'Varun Nair',
    gamerTag: 'BladeFury',
    email: 'varun.nair26@pccoe.edu.in',
    phone: '9823011008',
    college: 'PCCOE Pune',
    rollNumber: 'ET26-AIML-08',
    preferredFighter: 'Sonya Blade',
    age: 19,
  },
  {
    fullName: 'Pranav Joshi',
    gamerTag: 'Warlord99',
    email: 'pranav.joshi26@dypatil.edu',
    phone: '9823011009',
    college: 'DY Patil College of Engineering',
    rollNumber: 'ET26-COMP-09',
    preferredFighter: 'Baraka',
    age: 20,
  },
  {
    fullName: 'Riya Singhania',
    gamerTag: 'WindStorm',
    email: 'riya.singhania26@sinhgad.edu',
    phone: '9823011010',
    college: 'Sinhgad College of Engineering',
    rollNumber: 'ET26-IT-10',
    preferredFighter: 'Fujin',
    age: 21,
  },
];

async function main() {
  console.log(`Starting 10 contender registrations via platform allocation engine...`);

  const results = [];

  for (let i = 0; i < TEN_CONTENDERS.length; i++) {
    const c = TEN_CONTENDERS[i];
    const input = {
      ...c,
      agreeTerms: true,
      formLoadedAt: Date.now() - 5000,
      honeypot: '',
    };

    const res = await registerParticipant(input);
    if (res.success) {
      console.log(
        `[#${i + 1}] Registered: ${c.fullName} (${c.gamerTag}) -> Slot #${String(res.slotNumber).padStart(3, '0')} | Pass ID: ${res.registrationId} | Pool: ${res.pool}`
      );
      results.push({ ...c, ...res });
    } else {
      console.error(`[#${i + 1}] FAILED for ${c.fullName}:`, res.error);
    }
  }

  const total = await prisma.participant.count();
  console.log(`\nRegistration complete! Total participants in database: ${total}`);
  return results;
}

main()
  .catch((err) => {
    console.error('Registration run error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
