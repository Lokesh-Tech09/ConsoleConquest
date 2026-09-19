import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, ShieldCheck } from 'lucide-react';
import RegistrationForm from '@/components/RegistrationForm';
import SlotCounter from '@/components/SlotCounter';

export const metadata = {
  title: 'Register Fighter | Console Conquest MK11 Tournament',
  description: 'Submit your credentials to claim a numbered tournament slot in Console Conquest 1v1 Mortal Kombat 11 championship.',
};

export default function RegisterPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            prefetch={true}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-red-400 transition-colors cursor-pointer touch-manipulation active:scale-95 duration-75"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>BACK TO ARENA</span>
          </Link>
          <SlotCounter compact />
        </div>

        <RegistrationForm />
      </div>
    </div>
  );
}
