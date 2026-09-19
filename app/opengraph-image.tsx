import { ImageResponse } from 'next/og';
import { EVENT_CONFIG } from '@/lib/config';

export const runtime = 'edge';
export const alt = 'Console Conquest - Mortal Kombat 11 1v1 Tournament at AISSMS COE';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#07090e',
          backgroundImage:
            'radial-gradient(circle at 50% 35%, rgba(225, 29, 72, 0.28) 0%, rgba(15, 10, 18, 0.95) 75%, #050608 100%)',
          border: '12px solid #1e131b',
          position: 'relative',
          padding: '40px 60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top Tagline / Host */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(225, 29, 72, 0.15)',
            border: '1.5px solid rgba(225, 29, 72, 0.5)',
            borderRadius: '9999px',
            padding: '8px 24px',
            marginBottom: '20px',
          }}
        >
          <span
            style={{
              color: '#f87171',
              fontSize: '15px',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            AISSMS COE • 21st Engineering Today 2026
          </span>
        </div>

        {/* Main Tournament Title */}
        <h1
          style={{
            fontSize: '68px',
            fontWeight: 900,
            color: '#ffffff',
            margin: '0',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textShadow: '0 0 40px rgba(225, 29, 72, 0.8), 0 4px 12px rgba(0,0,0,0.9)',
          }}
        >
          CONSOLE CONQUEST
        </h1>

        {/* Game Subtitle */}
        <p
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#f97316',
            marginTop: '8px',
            marginBottom: '32px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            textShadow: '0 0 20px rgba(249, 115, 22, 0.6)',
          }}
        >
          MORTAL KOMBAT 11 • 1V1 TOURNAMENT
        </p>

        {/* Stats Grid Pill Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '36px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '16px 40px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: '#f59e0b', fontSize: '24px', fontWeight: 900 }}>₹8,000/-</span>
            <span style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Prize Pool</span>
          </div>
          <div style={{ width: '1px', height: '32px', backgroundColor: '#334155' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: '#f43f5e', fontSize: '24px', fontWeight: 900 }}>128 Slots</span>
            <span style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>4 Pools of 32</span>
          </div>
          <div style={{ width: '1px', height: '32px', backgroundColor: '#334155' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: '#38bdf8', fontSize: '24px', fontWeight: 900 }}>PlayStation 5</span>
            <span style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Local 1v1 Versus</span>
          </div>
          <div style={{ width: '1px', height: '32px', backgroundColor: '#334155' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: '#34d399', fontSize: '24px', fontWeight: 900 }}>₹100</span>
            <span style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Entry Fee</span>
          </div>
        </div>

        {/* Bottom Callout */}
        <p
          style={{
            fontSize: '14px',
            color: '#cbd5e1',
            marginTop: '28px',
            letterSpacing: '0.1em',
            fontWeight: 600,
          }}
        >
          29th &amp; 30th September 2026 • Room No. 340, AISSMS COE Campus, Pune
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
