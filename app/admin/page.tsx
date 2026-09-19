import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import AdminDashboard from '@/components/AdminDashboard';

export const metadata = {
  title: 'Organizer Command Center | Console Conquest MK11',
  description: 'Protected administrator portal for participant management, tournament bracket updating, and slot settings.',
};

export default function AdminPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-red-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>RETURN TO PUBLIC ARENA</span>
          </Link>
        </div>

        <AdminDashboard />
      </div>
    </div>
  );
}
