'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { BreathingCircle } from './breathing-circle';
import { TECHNIQUES, MOOD_OPTIONS, MOOD_SUGGESTIONS, suggestTechnique, type Technique } from '@/lib/techniques';
import { playSound, stopSound, playTick } from '@/lib/soundscape';

type Step = 'choose' | 'session' | 'journal' | 'done';

interface Props {
  initialTechnique?: Technique;
  initialMoodId?: string;
  onComplete: (data: { technique: string; durationSec: number; moodBefore: number; moodAfter: number; journal: string }) => void;
  onBack: () => void;
}

const JOURNAL_HINTS = [
  'thư giãn hơn rồi', 'vẫn còn căng một chút', 'nhẹ nhàng hơn nhiều',
  'tập trung hơn', 'buồn ngủ rồi 😴', 'tỉnh táo hơn', 'bình yên',
  'vẫn đang lo', 'thở xong thấy khác', 'cần thở thêm',
];

export function BreathingSession({ initialTechnique, initialMoodId, onComplete, onBack }: Props) {
  const [step, setStep] = useState<Step>(initialTechnique ? 'session' : 'choose');
  const [tech, setTech] = useState<Technique>(initialTechnique || TECHNIQUES[0]);
  const [cycleIdx, setCycleIdx] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [moodAfter, setMoodAfter] = useState(0);
  const [journal, setJournal] = useState('');
  const [soundOn, setSoundOn] = useState(true);
  const [vol, setVol] = useState(0.3);
  const timerRef = useRef<any>(null);
  const phaseRef = useRef(phaseIdx);
  const cycleRef = useRef(cycleIdx);
  phaseRef.current = phaseIdx;
  cycleRef.current = cycleIdx;

  const haptic = (pattern?: number[]) => {
    try { navigator.vibrate?.(pattern || [30]); } catch {}
  };

  const startSession = useCallback((t: Technique) => {
    setTech(t);
    setCycleIdx(0); setPhaseIdx(0);
    setSeconds(t.phases[0].seconds);
    setStartTime(Date.now());
    setStep('session');
    if (soundOn) playSound(t.soundscape, vol);
    haptic([40]);
  }, [soundOn, vol]);

  useEffect(() => {
    if (step !== 'session') return;
    timerRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          const pi = phaseRef.current;
          const ci = cycleRef.current;
          const nextPi = pi + 1;
          if (nextPi >= tech.phases.length) {
            const nextCi = ci + 1;
            if (nextCi >= tech.cycles) {
              clearInterval(timerRef.current);
              setElapsed(Math.round((Date.now() - startTime) / 1000));
              stopSound();
              haptic([50, 50, 100]);
              setStep('journal');
              return 0;
            }
            setCycleIdx(nextCi);
            setPhaseIdx(0);
            const ph = tech.phases[0];
            playTick(ph.type);
            haptic([25]);
            setTimeout(() => setSeconds(ph.seconds), 50);
          } else {
            setPhaseIdx(nextPi);
            const ph = tech.phases[nextPi];
            playTick(ph.type);
            haptic([25]);
            setTimeout(() => setSeconds(ph.seconds), 50);
          }
          return s;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [step, tech, startTime]);

  const stop = () => {
    clearInterval(timerRef.current);
    stopSound();
    setElapsed(Math.round((Date.now() - startTime) / 1000));
    setStep('journal');
  };

  const currentPhase = tech.phases[phaseIdx] || tech.phases[0];
  const totalCycles = tech.cycles;

  // ── Choose screen ──────────────────────────────────────────────────────────
  if (step === 'choose') return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '20px 16px 100px' }}>
      <button onClick={onBack} style={{ fontSize: 13, color: 'var(--text3)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16 }}>← Quay lại</button>
      <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text1)', marginBottom: 4 }}>Hôm nay thở bài nào?</p>
      <p style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 20 }}>8 bài — mỗi bài một tác dụng riêng 🌿</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {TECHNIQUES.map(t => (
          <div key={t.id} onClick={() => startSession(t)}
            style={{ borderRadius: 20, padding: '16px', cursor: 'pointer', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 2px 8px var(--shadow)', transition: 'all 0.18s' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: `${t.tagColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                {t.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text1)' }}>{t.name}</p>
                  <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, color: 'white', background: t.tagColor }}>
                    {t.tag}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 2 }}>{t.tagline}</p>
                <p style={{ fontSize: 11, color: 'var(--text4)' }}>⏱ {t.duration}</p>
              </div>
              <span style={{ fontSize: 18, color: 'var(--text4)' }}>›</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Session screen ─────────────────────────────────────────────────────────
  if (step === 'session') return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, #e8f7f2 0%, #f0f9f5 100%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '32px 20px 28px' }}>
      <style>{`
        @keyframes breathe-in{0%{transform:scale(1)}100%{transform:scale(1.35)}}
        @keyframes breathe-out{0%{transform:scale(1.35)}100%{transform:scale(1)}}
        @keyframes breathe-hold{0%,100%{transform:scale(1.35);opacity:.9}50%{transform:scale(1.33);opacity:1}}
        @keyframes breathe-hold2{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.02);opacity:1}}
        @keyframes ring-pulse{0%{transform:scale(1);opacity:.6}50%{transform:scale(1.08);opacity:.2}100%{transform:scale(1.15);opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Top bar */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text2)' }}>{tech.emoji} {tech.name}</p>
          <p style={{ fontSize: 12, color: 'var(--text3)' }}>Vòng {cycleIdx + 1} / {totalCycles}</p>
        </div>
        <button onClick={() => setSoundOn(s => { const n=!s; if(n) playSound(tech.soundscape,vol); else stopSound(); return n; })}
          style={{ padding: '6px 12px', borderRadius: 20, border: '1px solid var(--border)', background: soundOn ? 'var(--green5)' : 'var(--surface2)', color: 'var(--text2)', fontSize: 13, cursor: 'pointer', fontWeight: 700 }}>
          {soundOn ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Circle */}
      <BreathingCircle
        phase={currentPhase.type}
        totalSeconds={currentPhase.seconds}
        secondsLeft={seconds}
        isActive={true}
        label={currentPhase.label}
        whisper={currentPhase.whisper}
      />

      {/* Cycle dots */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {Array.from({ length: totalCycles }).map((_, i) => (
          <div key={i} style={{ width: i === cycleIdx ? 20 : 8, height: 8, borderRadius: 4, background: i < cycleIdx ? 'var(--green2)' : i === cycleIdx ? 'var(--green1)' : 'var(--green4)', transition: 'all 0.3s' }} />
        ))}
      </div>

      {/* Nhắm mắt hint + stop */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <p style={{ fontSize: 12, color: 'var(--text4)', fontStyle: 'italic' }}>Bạn có thể nhắm mắt thoải mái 🌿</p>
        <button onClick={stop} style={{ padding: '10px 32px', borderRadius: 16, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.8)', color: 'var(--text3)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          Dừng lại
        </button>
      </div>
    </div>
  );

  // ── Journal screen ─────────────────────────────────────────────────────────
  if (step === 'journal') return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 20px 32px', gap: 24 }}>
      <div style={{ fontSize: 56, animation: 'popIn 0.4s ease-out' }}>🌿</div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text1)', marginBottom: 6 }}>Xong rồi!</p>
        <p style={{ fontSize: 14, color: 'var(--text2)' }}>{Math.floor(elapsed/60)} phút {elapsed%60} giây · {tech.name}</p>
      </div>

      {/* Mood after */}
      <div style={{ width: '100%', maxWidth: 340 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text2)', marginBottom: 12, textAlign: 'center' }}>Bây giờ bạn cảm thấy thế nào?</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {MOOD_OPTIONS.slice(0,6).map(m => (
            <button key={m.id} onClick={() => setMoodAfter(MOOD_OPTIONS.indexOf(m)+1)}
              style={{ padding: '8px 14px', borderRadius: 20, border: `2px solid ${moodAfter === MOOD_OPTIONS.indexOf(m)+1 ? m.color : 'var(--border)'}`, background: moodAfter === MOOD_OPTIONS.indexOf(m)+1 ? `${m.color}15` : 'var(--surface)', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--text2)', transition: 'all 0.15s' }}>
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Journal */}
      <div style={{ width: '100%', maxWidth: 340 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text2)', marginBottom: 8 }}>Ghi nhanh một câu không? <span style={{ fontWeight: 400, color: 'var(--text4)' }}>(không bắt buộc)</span></p>
        <textarea
          value={journal}
          onChange={e => setJournal(e.target.value)}
          placeholder="Cảm giác thế nào sau khi thở..."
          rows={2}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 16, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text1)', fontSize: 14, resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5 }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {JOURNAL_HINTS.slice(0,6).map(h => (
            <button key={h} onClick={() => setJournal(h)}
              style={{ padding: '5px 12px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 12, color: 'var(--text3)', cursor: 'pointer' }}>
              {h}
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => onComplete({ technique: tech.name, durationSec: elapsed, moodBefore: 0, moodAfter, journal })}
        style={{ width: '100%', maxWidth: 340, padding: '15px', borderRadius: 20, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, var(--green1), var(--green2))', color: 'white', fontSize: 16, fontWeight: 800, boxShadow: '0 6px 20px rgba(45,158,122,0.3)' }}>
        Lưu lại 🌱
      </button>
    </div>
  );

  return null;
}
