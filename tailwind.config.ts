import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: '#070709',
          card: '#0e1017',
          cardBorder: '#232838',
          cardHover: '#161924',
          dark: '#0a0b10',
          metal: '#1c202d',
          accent: '#e11d48',
          crimson: '#be123c',
          blood: '#881337',
          ember: '#f97316',
          gold: '#eab308',
          subzero: '#0284c7',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Impact', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        'glow-crimson': '0 0 25px -3px rgba(225, 29, 72, 0.45), 0 0 10px -2px rgba(225, 29, 72, 0.3)',
        'glow-ember': '0 0 25px -3px rgba(249, 115, 22, 0.4), 0 0 10px -2px rgba(249, 115, 22, 0.25)',
        'glow-gold': '0 0 25px -3px rgba(234, 179, 8, 0.4), 0 0 10px -2px rgba(234, 179, 8, 0.25)',
        'glow-subzero': '0 0 25px -3px rgba(2, 132, 199, 0.4), 0 0 10px -2px rgba(2, 132, 199, 0.25)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flame-flicker': 'flameFlicker 3s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(225, 29, 72, 0.6))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(225, 29, 72, 0.95))' },
        },
        flameFlicker: {
          '0%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.03)', opacity: '1' },
          '100%': { transform: 'scale(0.98)', opacity: '0.9' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
