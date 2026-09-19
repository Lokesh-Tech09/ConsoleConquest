'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  fadeSpeed: number;
  color: string;
}

export default function ArenaParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let isPaused = false;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Pause canvas when tab is hidden to save CPU and battery
    const handleVisibility = () => {
      isPaused = document.hidden;
      if (!isPaused) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    const colors = [
      'rgba(225, 29, 72, ',   // Crimson
      'rgba(249, 115, 22, ',  // Ember Orange
      'rgba(239, 68, 68, ',   // Red
      'rgba(251, 146, 60, ',  // Light flame
    ];

    // High performance: keep particle count light (25-40 max)
    const particleCount = Math.min(Math.floor(width / 35), 38);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: -(Math.random() * 0.9 + 0.3),
        opacity: Math.random() * 0.6 + 0.2,
        fadeSpeed: Math.random() * 0.006 + 0.002,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let lastTime = performance.now();

    const render = (now: number) => {
      if (isPaused) return;

      // Cap to ~45-60 FPS delta to prevent CPU spikes on 144Hz+ monitors
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const speedMultiplier = delta * 60;

      ctx.clearRect(0, 0, width, height);

      // HIGH PERFORMANCE: Zero ctx.shadowBlur!
      // Rendering with solid fill is 30x faster than software shadowBlur filters
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX * speedMultiplier;
        p.y += p.speedY * speedMultiplier;
        p.opacity -= p.fadeSpeed * speedMultiplier;

        if (p.opacity <= 0 || p.y < -10 || p.x < -10 || p.x > width + 10) {
          p.x = Math.random() * width;
          p.y = height + 10;
          p.opacity = Math.random() * 0.6 + 0.25;
          p.speedY = -(Math.random() * 0.9 + 0.3);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, p.opacity).toFixed(2)})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-50"
      aria-hidden="true"
    />
  );
}
