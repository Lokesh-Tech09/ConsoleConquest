import { prisma } from '../lib/db';
import { ensureBracketMatchesExist } from '../lib/bracketManager';

async function main() {
  console.log('--- Upgrading Tournament to 256 Slots & Pools A-H ---');

  // 1. Update MAX_SLOTS setting in database
  const setting = await prisma.tournamentSetting.upsert({
    where: { key: 'MAX_SLOTS' },
    update: { value: '256' },
    create: { key: 'MAX_SLOTS', value: '256' },
  });
  console.log(`✓ Updated MAX_SLOTS setting to: ${setting.value}`);

  // 2. Generate matches for all 8 pools (A through H) and 3-round FINALS
  await ensureBracketMatchesExist();
  console.log('✓ Bracket matches verified and created.');

  // 3. Inspect summary
  const matchCounts = await prisma.match.groupBy({
    by: ['pool'],
    _count: { id: true },
  });
  console.log('Match breakdown by pool:', matchCounts);

  const totalMatches = await prisma.match.count();
  console.log(`Total matches in DB: ${totalMatches}`);

  const participantCount = await prisma.participant.count();
  console.log(`Active registered participants preserved: ${participantCount}`);
}

main()
  .catch((err) => {
    console.error('Upgrade failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
