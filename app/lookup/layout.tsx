import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Check Registration Pass & Slot Status | Console Conquest MK11',
  description: 'Search and verify your Console Conquest 128-contender tournament pass, assigned pool, slot number, and desk check-in badge.',
};

export default function LookupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
