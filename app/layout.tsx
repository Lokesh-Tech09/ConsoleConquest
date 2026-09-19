import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArenaParticles from '@/components/ArenaParticles';
import CookieConsent from '@/components/CookieConsent';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import AnalyticsProvider from '@/components/AnalyticsProvider';
import { EVENT_CONFIG } from '@/lib/config';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://consoleconquest.aissms.ac.in';

export const viewport: Viewport = {
  themeColor: '#07090e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${EVENT_CONFIG.EVENT_NAME} | ${EVENT_CONFIG.GAME_NAME} 1v1 Tournament`,
    template: `%s | ${EVENT_CONFIG.EVENT_NAME}`,
  },
  description:
    'Official collegiate Mortal Kombat 11 1v1 Tournament at AISSMS COE (21st Engineering Today 2026). ₹8,000 Prize Pool, 128 contenders, 4 pools of 32, zero automatic byes on PlayStation 5. Register now for ₹100.',
  keywords: [
    'Mortal Kombat 11',
    'Console Conquest',
    'Esports Tournament',
    'AISSMS COE',
    'Engineering Today 2026',
    'AIML Department',
    'PS5 Gaming Championship',
    'College Esports Pune',
    '1v1 Knockout',
  ],
  authors: [{ name: 'AISSMS COE - Department of AIML' }],
  creator: 'AISSMS COE AIML Dept',
  publisher: 'AISSMS College of Engineering, Pune',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icon.svg' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'Console Conquest - Mortal Kombat 11 Tournament',
    title: 'Console Conquest | Mortal Kombat 11 1v1 Esports Championship',
    description:
      'Enter the arena for Console Conquest: Mortal Kombat 11 1v1 college esports championship at AISSMS COE. 128 Contenders, ₹8,000 Prize Pool, Live Brackets.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Console Conquest - Mortal Kombat 11 Tournament at AISSMS COE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Console Conquest | Mortal Kombat 11 1v1 Esports Tournament',
    description:
      'Enter the arena for Console Conquest: Mortal Kombat 11 1v1 championship at AISSMS COE. ₹8,000 Prize Pool, 128 slots.',
    images: ['/opengraph-image'],
    creator: '@AISSMSCOE',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-arena-bg text-slate-100 antialiased selection:bg-red-600 selection:text-white">
        <AnalyticsProvider />
        <ArenaParticles />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
        </div>
        <StickyMobileCTA />
        <CookieConsent />
      </body>
    </html>
  );
}
