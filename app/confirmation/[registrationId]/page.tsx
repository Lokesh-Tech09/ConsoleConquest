import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ConfirmationCard from '@/components/ConfirmationCard';
import { ParticipantData } from '@/lib/types';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { registrationId: string };
}

export async function generateMetadata({ params }: PageProps) {
  const regId = decodeURIComponent(params.registrationId);
  return {
    title: `Pass ${regId} | Console Conquest MK11`,
    description: `Official registration confirmation for ${regId} in Console Conquest Mortal Kombat 11 tournament.`,
  };
}

export default async function ConfirmationPage({ params }: PageProps) {
  const regId = decodeURIComponent(params.registrationId).trim();

  const participant = await prisma.participant.findUnique({
    where: { registrationId: regId },
  });

  if (!participant) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-red-800 bg-red-950/60 p-8">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 font-heading text-2xl font-black text-white">PASS NOT FOUND</h2>
          <p className="mt-2 text-xs text-slate-300">
            No active fighter credential matching &ldquo;{regId}&rdquo; was found in the tournament database.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-red-500 bg-red-800 px-6 py-2.5 font-heading text-xs font-bold text-white shadow-glow-crimson"
          >
            ENTER THE ARENA
          </Link>
        </div>
      </div>
    );
  }

  // Cast dates to ISO strings / compatible format
  const serializedParticipant: ParticipantData = {
    ...participant,
    status: participant.status as ParticipantData['status'],
    createdAt: participant.createdAt.toISOString(),
    updatedAt: participant.updatedAt.toISOString(),
    checkedInAt: participant.checkedInAt ? participant.checkedInAt.toISOString() : null,
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-red-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>RETURN TO ARENA HOME</span>
          </Link>
        </div>

        <ConfirmationCard participant={serializedParticipant} />
      </div>
    </div>
  );
}
