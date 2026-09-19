import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const participants = await prisma.participant.findMany({
      orderBy: [{ slotNumber: 'asc' }, { createdAt: 'asc' }],
    });

    const headers = [
      'Slot Number',
      'Registration ID',
      'Full Name',
      'Gamer Tag',
      'Preferred Fighter',
      'College',
      'Student Roll No',
      'Email',
      'Phone',
      'Status',
      'Waitlist Pos',
      'Registered At',
    ];

    const rows = participants.map((p) => [
      p.slotNumber ? String(p.slotNumber) : 'N/A',
      p.registrationId,
      `"${p.fullName.replace(/"/g, '""')}"`,
      `"${p.gamerTag.replace(/"/g, '""')}"`,
      p.preferredFighter || 'N/A',
      `"${p.college.replace(/"/g, '""')}"`,
      p.rollNumber,
      p.email,
      p.phone,
      p.status,
      p.waitlistPosition ? String(p.waitlistPosition) : 'N/A',
      new Date(p.createdAt).toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="ConsoleConquest_Participants_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Export failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
