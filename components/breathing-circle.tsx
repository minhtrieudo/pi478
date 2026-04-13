'use client';

import { useEffect, useState } from 'react';

type PhaseType = 'inhale' | 'hold' | 'exhale' | 'hold2';

interface Props {
  phase: PhaseType;
  totalSeconds: number;
  secondsLeft: number;
  isActive: boolean;
  label: string;
  whisper: string;
}

const PHASE_COLORS = {
  inhale:  { bg: '#3bb88f', ring: '#6dd4b0', text: '#1a5c45' },
  hold:    { bg: '#6b8cc4', ring: '#9bb5e0', text: '#1a2f5c' },
  exhale:  { bg: '#3b82c4', ring: '#6aaee0', text: '#1a2f5c' },
  hold2:   { bg: '#9b8ec4', ring: '#c4b8e0', text: '#2a1a5c' },
};

export function BreathingCircle({ phase, totalSeconds, secondsLeft, isActive, label, whisper }: Props) {
  const cfg = PHASE_COLORS[phase];
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;

  const getAnim = () => {
    if (!isActive) return 'none';
    if (phase === 'inhale') return 'breathe-in';
    if (phase === 'exhale') return 'breathe-out';
    if (phase === 'hold') return 'breathe-hold';
    return 'breathe-hold2';
  };

  const getDuration = () => {
    if (phase === 'inhale' || phase === 'exhale') return `${totalSeconds}s`;
    return '2s';
  };

  const R = 90;
  const circumference = 2 * Math.PI * R;
  const dashOffset = circumference * (1 - progress);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '10px 0' }}>

      {/* Main circle */}
      <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Outer ring glow */}
        <div style={{
          position: 'absolute', width: 220, height: 220, borderRadius: '50%',
          background: `radial-gradient(circle, ${cfg.ring}30 0%, transparent 70%)`,
          animation: 'ring-pulse 2s ease-out infinite',
        }} />

        {/* Progress arc */}
        <svg width="220" height="220" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
          <circle cx="110" cy="110" r={R} fill="none" stroke={`${cfg.ring}30`} strokeWidth="4" />
          <circle cx="110" cy="110" r={R} fill="none" stroke={cfg.ring} strokeWidth="4"
            strokeDasharray={circumference} strokeDashoffset={dashOffset}
            strokeLinecap="round" style={{ transition: `stroke-dashoffset ${secondsLeft > 0 ? '1s' : '0.1s'} linear` }}
          />
        </svg>

        {/* Breathing ball */}
        <div style={{
          width: 140, height: 140, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${cfg.ring}, ${cfg.bg})`,
          boxShadow: `0 8px 32px ${cfg.bg}50, 0 0 0 8px ${cfg.ring}20`,
          animation: `${getAnim()} ${getDuration()} ease-in-out ${phase === 'inhale' ? 'forwards' : phase === 'exhale' ? 'forwards' : 'infinite'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 2,
        }}>
          <span style={{ fontSize: 38, fontWeight: 900, color: 'white', lineHeight: 1, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
            {secondsLeft}
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 700, letterSpacing: 0.5 }}>giây</span>
        </div>
      </div>

      {/* Label */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: cfg.bg, marginBottom: 6, letterSpacing: 0.3 }}>
          {label}
        </p>
        <p key={`${phase}-${secondsLeft}`} style={{
          fontSize: 14, color: 'var(--text3)', fontStyle: 'italic',
          animation: 'fadeUp 0.5s ease-out',
          maxWidth: 260, textAlign: 'center', lineHeight: 1.5,
        }}>
          {whisper}
        </p>
      </div>
    </div>
  );
}
