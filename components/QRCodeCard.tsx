'use client';

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeCardProps {
  value: string;
  size?: number;
}

export default function QRCodeCard({ value, size = 180 }: QRCodeCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 1.5,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      }).catch((err) => {
        console.error('Error generating QR code:', err);
      });
    }
  }, [value, size]);

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-500/30 bg-white p-3 shadow-glow-crimson">
      <canvas ref={canvasRef} className="rounded" />
      <span className="mt-1.5 text-[10px] font-black uppercase tracking-widest text-black">
        SCAN TO VERIFY PASS
      </span>
    </div>
  );
}
