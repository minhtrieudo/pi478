'use client';

import { useEffect, useRef } from 'react';

interface BreathingHeartProps {
  phase: 'inhale' | 'hold' | 'exhale' | 'hold2';
  isActive: boolean;
  seconds: number;
  label: string;
}

const PHASE_CONFIG = {
  inhale:  { color: '#3b82f6', glow: 'rgba(59,130,246,0.35)', scale: 1.28, label: 'Hít vào' },
  hold:    { color: '#8b5cf6', glow: 'rgba(139,92,246,0.35)', scale: 1.22, label: 'Nín thở' },
  exhale:  { color: '#10b981', glow: 'rgba(16,185,129,0.35)', scale: 0.88, label: 'Thở ra' },
  hold2:   { color: '#6366f1', glow: 'rgba(99,102,241,0.3)',  scale: 0.9,  label: 'Nín thở' },
};

export function BreathingHeart({ phase, isActive, seconds, label }: BreathingHeartProps) {
  const cfg = PHASE_CONFIG[phase];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>

      {/* Outer glow ring */}
      <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Pulsing glow layers */}
        {[1.6, 1.35, 1.1].map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 160, height: 160,
            borderRadius: '50%',
            background: cfg.glow,
            transform: `scale(${isActive ? s : 1})`,
            opacity: isActive ? 0.15 - i * 0.04 : 0,
            transition: `transform ${phase === 'inhale' ? '4s' : phase === 'exhale' ? '4s' : '0.3s'} ease-in-out, opacity 0.5s`,
          }} />
        ))}

        {/* Heart SVG */}
        <div style={{
          width: 160, height: 160,
          transform: isActive ? `scale(${cfg.scale})` : 'scale(1)',
          transition: `transform ${phase === 'inhale' ? '4s' : phase === 'exhale' ? '5s' : '0.5s'} ease-in-out`,
          filter: isActive ? `drop-shadow(0 0 18px ${cfg.color})` : 'none',
        }}>
          <svg viewBox="0 0 100 92" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="hg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={cfg.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={cfg.color} stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <path
              d="M50,85 C18,62 2,46 2,28 C2,14 12,4 24,4 C33,4 41,9 50,20 C59,9 67,4 76,4 C88,4 98,14 98,28 C98,46 82,62 50,85 Z"
              fill="url(#hg)"
            />
            <path
              d="M50,85 C18,62 2,46 2,28 C2,14 12,4 24,4 C33,4 41,9 50,20 C59,9 67,4 76,4 C88,4 98,14 98,28 C98,46 82,62 50,85 Z"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
            {/* Shine */}
            <ellipse cx="35" cy="28" rx="10" ry="7" fill="rgba(255,255,255,0.25)" transform="rotate(-30,35,28)" />
          </svg>
        </div>

        {/* Center text */}
        <div style={{
          position: 'absolute',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <p style={{ fontSize: 36, fontWeight: 900, color: 'white', lineHeight: 1, textShadow: `0 0 20px ${cfg.color}` }}>
            {seconds}
          </p>
        </div>
      </div>

      {/* Phase label */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: cfg.color, letterSpacing: 1 }}>
          {label}
        </p>
      </div>
    </div>
  );
}
