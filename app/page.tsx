'use client';

import { useState, useEffect } from 'react';
import { BreathingSession } from '@/components/breathing-session';
import { BreathingTree } from '@/components/breathing-tree';
import { usePiAuth } from '@/contexts/pi-auth-context';
import { getOrCreateUser, saveSession, updateUserAfterSession, getRecentSessions, type UserRow, type SessionRow } from '@/lib/supabase';
import { MOOD_OPTIONS, MOOD_SUGGESTIONS, suggestTechnique, type Technique } from '@/lib/techniques';
import { SESSION_COMPLIMENTS, getHoiMessage } from '@/lib/hoi-personality';

type View = 'home' | 'mood' | 'session' | 'history';

export default function App() {
  const { user: piUser, isAuthenticated } = usePiAuth();
  const [view, setView]         = useState<View>('home');
  const [userData, setUserData] = useState<UserRow | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading]   = useState(true);

  const [todayMood, setTodayMood]       = useState<string | null>(null);
  const [suggested, setSuggested]       = useState<Technique | null>(null);
  const [showMoodSuggest, setShowMoodSuggest] = useState(false);
  const [toast, setToast]               = useState('');
  const [treeShake, setTreeShake]       = useState(false);
  const [sessionTech, setSessionTech]   = useState<Technique | undefined>(undefined);

  const name = piUser?.username?.split('_')[0] || 'Bạn';
  const hour = new Date().getHours();

  useEffect(() => {
    if (!isAuthenticated || !piUser) return;
    (async () => {
      const u = await getOrCreateUser(piUser.uid, piUser.username);
      setUserData(u);
      const s = await getRecentSessions(piUser.uid, 30);
      setSessions(s);
      setLoading(false);
    })();
  }, [isAuthenticated, piUser]);

  const showToast = (msg: string, dur = 5000) => {
    setToast(msg);
    setTimeout(() => setToast(''), dur);
  };

  const handleMoodSelect = (moodId: string) => {
    setTodayMood(moodId);
    const tech = suggestTechnique(moodId);
    setSuggested(tech);
    setShowMoodSuggest(true);
  };

  const handleSessionComplete = async (data: {
    technique: string; durationSec: number;
    moodBefore: number; moodAfter: number; journal: string;
  }) => {
    if (!piUser || !userData) return;
    await saveSession({
      pi_uid: piUser.uid, technique_name: data.technique,
      duration_seconds: data.durationSec, completed: true,
      mood_before: data.moodBefore, mood_after: data.moodAfter,
    });
    await updateUserAfterSession(piUser.uid, data.durationSec, data.technique);
    const [u, s] = await Promise.all([
      getOrCreateUser(piUser.uid, piUser.username),
      getRecentSessions(piUser.uid, 30),
    ]);
    setUserData(u); setSessions(s);
    setTreeShake(true);
    setTimeout(() => setTreeShake(false), 900);
    const c = SESSION_COMPLIMENTS[Math.floor(Math.random() * SESSION_COMPLIMENTS.length)];
    showToast(c, 6000);
    setView('home');
    setSessionTech(undefined);
    setShowMoodSuggest(false);
  };

  const today = new Date().toISOString().split('T')[0];
  const trainedToday = userData?.last_session_date === today;
  const streak = userData?.streak_days || 0;
  const isWilting = userData?.last_session_date
    ? (Date.now() - new Date(userData.last_session_date).getTime()) / 86400000 >= 2
    : false;

  const getGreeting = () => {
    if (hour < 6)  return `Thức khuya vậy ${name}? 🌙`;
    if (hour < 12) return `Chào buổi sáng ${name}! ☀️`;
    if (hour < 14) return `Ăn trưa chưa ${name}? 🌿`;
    if (hour < 18) return `Buổi chiều của ${name} 💙`;
    if (hour < 22) return `Tối rồi ${name} ơi 🌙`;
    return `Khuya rồi ${name}... 💤`;
  };

  const getSubGreeting = () => {
    if (trainedToday) return `Hôm nay bạn đã thở rồi ✨ Giỏi quá!`;
    if (isWilting) return `Cây đang nhớ bạn... thở một chút nhé?`;
    if (streak > 0) return `${streak} ngày streak 🔥 — đừng để chuỗi bị đứt nhé`;
    return `Hôm nay thở cùng mình nhé?`;
  };

  const getMoodData = () => {
    const dl = ['CN','T2','T3','T4','T5','T6','T7'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6-i));
      const ds = d.toISOString().split('T')[0];
      const sess = sessions.find(s => s.created_at?.startsWith(ds));
      return { day: dl[d.getDay()], has: !!sess, technique: sess?.technique_name || '' };
    });
  };

  if (!isAuthenticated || loading) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}} @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes popIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}} *{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ animation: 'breathe 2.5s ease-in-out infinite' }}>
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="var(--green4)" strokeWidth="3"/>
          <circle cx="32" cy="32" r="20" fill="var(--green3)" opacity="0.6"/>
        </svg>
      </div>
      <p style={{ color: 'var(--text3)', fontSize: 14, fontWeight: 600 }}>Đang kết nối...</p>
    </div>
  );

  if (view === 'session') return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <style>{`@keyframes breathe-in{0%{transform:scale(1)}100%{transform:scale(1.35)}} @keyframes breathe-out{0%{transform:scale(1.35)}100%{transform:scale(1)}} @keyframes breathe-hold{0%,100%{transform:scale(1.35);opacity:.9}50%{opacity:1}} @keyframes breathe-hold2{0%,100%{transform:scale(1);opacity:.85}50%{opacity:1}} @keyframes ring-pulse{0%{transform:scale(1);opacity:.6}50%{transform:scale(1.08);opacity:.2}100%{transform:scale(1.15);opacity:0}} @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes popIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}} *{box-sizing:border-box;margin:0;padding:0}`}</style>
      <BreathingSession
        initialTechnique={sessionTech}
        initialMoodId={todayMood || undefined}
        onComplete={handleSessionComplete}
        onBack={() => { setView('home'); setSessionTech(undefined); }}
      />
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingBottom:90, fontFamily:'system-ui,sans-serif' }}>
      <style>{`@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}} @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes popIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}} @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}} @keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box;margin:0;padding:0}`}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:16, left:16, right:16, zIndex:100, padding:'14px 16px', borderRadius:18, background:'var(--surface)', border:'1px solid var(--green4)', boxShadow:'0 4px 20px var(--shadow)', animation:'fadeUp 0.4s ease-out' }}>
          <p style={{ fontSize:14, color:'var(--text1)', fontWeight:600, lineHeight:1.5 }}>✨ {toast}</p>
        </div>
      )}

      {/* Header */}
      <div style={{ padding:'20px 20px 0' }}>
        <p style={{ fontSize:22, fontWeight:900, color:'var(--text1)', marginBottom:4 }}>{getGreeting()}</p>
        <p style={{ fontSize:14, color:'var(--text3)', lineHeight:1.5 }}>{getSubGreeting()}</p>
      </div>

      {/* Mood check-in — hiện mỗi ngày */}
      {!todayMood && !showMoodSuggest && (
        <div style={{ margin:'16px 16px 0', padding:'16px', borderRadius:20, background:'var(--surface)', border:'1px solid var(--border)', boxShadow:'0 2px 8px var(--shadow)', animation:'fadeUp 0.4s ease-out' }}>
          <p style={{ fontSize:15, fontWeight:800, color:'var(--text1)', marginBottom:4 }}>Hôm nay bạn cảm thấy thế nào?</p>
          <p style={{ fontSize:13, color:'var(--text3)', marginBottom:14 }}>Mình sẽ gợi ý bài thở phù hợp cho bạn</p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {MOOD_OPTIONS.map(m => (
              <button key={m.id} onClick={() => handleMoodSelect(m.id)}
                style={{ padding:'8px 14px', borderRadius:20, border:`1px solid ${m.color}30`, background:`${m.color}10`, cursor:'pointer', fontSize:13, fontWeight:600, color:'var(--text2)', transition:'all 0.15s', display:'flex', alignItems:'center', gap:5 }}>
                <span>{m.emoji}</span> {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mood suggestion */}
      {showMoodSuggest && suggested && todayMood && (
        <div style={{ margin:'16px 16px 0', padding:'16px', borderRadius:20, background:`${suggested.tagColor}10`, border:`1px solid ${suggested.tagColor}30`, animation:'popIn 0.35s ease-out' }}>
          <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6, marginBottom:12 }}>
            💬 {MOOD_SUGGESTIONS[todayMood]}
          </p>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => { setSessionTech(suggested); setView('session'); }}
              style={{ flex:1, padding:'12px', borderRadius:16, border:'none', cursor:'pointer', background:`linear-gradient(135deg, ${suggested.tagColor}, ${suggested.tagColor}cc)`, color:'white', fontSize:14, fontWeight:800 }}>
              {suggested.emoji} Thử {suggested.name}
            </button>
            <button onClick={() => { setShowMoodSuggest(false); setView('session'); setSessionTech(undefined); }}
              style={{ padding:'12px 16px', borderRadius:16, border:'1px solid var(--border)', background:'var(--surface)', color:'var(--text3)', fontSize:13, fontWeight:700, cursor:'pointer' }}>
              Chọn khác
            </button>
          </div>
        </div>
      )}

      {/* Tree */}
      <div style={{ display:'flex', justifyContent:'center', padding:'20px 0 8px', animation: treeShake ? 'shake 0.6s ease-out' : 'none' }}>
        <BreathingTree stage={userData?.tree_stage||0} streak={streak} isWilting={isWilting} />
      </div>

      {/* Weekly heatmap */}
      <div style={{ padding:'0 16px', marginBottom:16 }}>
        <p style={{ fontSize:11, color:'var(--text4)', fontWeight:700, letterSpacing:0.5, marginBottom:8 }}>7 NGÀY QUA</p>
        <div style={{ display:'flex', gap:6 }}>
          {getMoodData().map((d,i) => (
            <div key={i} style={{ flex:1, textAlign:'center' }}>
              <div style={{ width:'100%', aspectRatio:'1', borderRadius:8, marginBottom:3, background: d.has ? 'var(--green3)' : 'var(--green5)', border:`1px solid ${d.has ? 'var(--green2)' : 'var(--border)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>
                {d.has ? '🫁' : ''}
              </div>
              <span style={{ fontSize:9, color:'var(--text4)', fontWeight:700 }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, padding:'0 16px', marginBottom:16 }}>
        {[
          { emoji:'🔥', val:streak, label:'ngày streak', accent: streak > 0 ? '#e08030' : 'var(--text4)' },
          { emoji:'⏱', val:userData?.total_minutes||0, label:'phút tập', accent:'var(--green1)' },
          { emoji:'🧘', val:userData?.total_sessions||0, label:'buổi tập', accent:'var(--blue1)' },
        ].map((s,i) => (
          <div key={i} style={{ borderRadius:18, padding:'12px 10px', textAlign:'center', background:'var(--surface)', border:'1px solid var(--border)', boxShadow:'0 1px 4px var(--shadow)' }}>
            <div style={{ fontSize:20, marginBottom:4 }}>{s.emoji}</div>
            <div style={{ fontSize:22, fontWeight:900, color:s.accent }}>{s.val}</div>
            <div style={{ fontSize:10, color:'var(--text4)', fontWeight:600, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Daily challenge */}
      <div style={{ margin:'0 16px 16px', padding:'14px 16px', borderRadius:18, background:'var(--surface2)', border:'1px solid var(--green4)' }}>
        <p style={{ fontSize:12, fontWeight:800, color:'var(--green1)', marginBottom:4, letterSpacing:0.3 }}>💡 THỬ THÁCH HÔM NAY</p>
        <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.5 }}>
          {hour < 12 ? 'Thở 3 phút trước khi bắt đầu làm việc — não bộ sẽ cảm ơn bạn đó.' :
           hour < 18 ? 'Thử Thở Hộp 4 phút trong giờ nghỉ — tập trung hơn cả buổi chiều.' :
           'Thở Ngủ Ngon 4-7-8 trước khi đi ngủ tối nay nhé?'}
        </p>
      </div>

      {/* Big CTA */}
      <div style={{ padding:'0 16px' }}>
        <button onClick={() => setView('session')}
          style={{ width:'100%', padding:'18px', borderRadius:24, border:'none', cursor:'pointer', background:'linear-gradient(135deg, var(--green1), var(--green2))', color:'white', fontSize:18, fontWeight:900, boxShadow:'0 8px 24px rgba(45,158,122,0.35)', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
          <span>🫁</span> Thở Ngay
        </button>
      </div>

      {/* History view */}
      {view === 'history' && (
        <div style={{ position:'fixed', inset:0, background:'var(--bg)', overflow:'auto', paddingBottom:80, zIndex:10 }}>
          <div style={{ padding:'20px 20px' }}>
            <button onClick={() => setView('home')} style={{ fontSize:13, color:'var(--text3)', background:'none', border:'none', cursor:'pointer', marginBottom:16 }}>← Về nhà</button>
            <h2 style={{ fontSize:22, fontWeight:800, color:'var(--text1)', marginBottom:6 }}>Nhật ký của bạn ✨</h2>
            <p style={{ fontSize:14, color:'var(--text3)', marginBottom:20 }}>{sessions.length} buổi tập đã lưu</p>
            {sessions.slice(0,20).map((s,i) => (
              <div key={i} style={{ padding:'14px', borderRadius:16, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:8, boxShadow:'0 1px 4px var(--shadow)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 4 }}>
                  <p style={{ fontSize:14, fontWeight:700, color:'var(--text1)' }}>{s.technique_name}</p>
                  <p style={{ fontSize:11, color:'var(--text4)' }}>{s.created_at?.split('T')[0]}</p>
                </div>
                <p style={{ fontSize:12, color:'var(--text3)' }}>
                  ⏱ {Math.floor((s.duration_seconds||0)/60)} phút
                  {s.mood_before && s.mood_after ? ` · Tâm trạng: ${s.mood_before} → ${s.mood_after}` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, display:'flex', background:'rgba(240,247,244,0.97)', backdropFilter:'blur(20px)', borderTop:'1px solid var(--border)', paddingBottom:'env(safe-area-inset-bottom)', zIndex:5 }}>
        {([
          ['home','🌿','Trang chủ'],
          ['session','🫁','Thở ngay'],
          ['history','📖','Nhật ký'],
        ] as const).map(([v,icon,label]) => {
          const active = view === v;
          return (
            <button key={v} onClick={() => setView(v as View)}
              style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'10px 4px 8px', background:'transparent', border:'none', cursor:'pointer', position:'relative' }}>
              {active && <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:2, borderRadius:2, background:'linear-gradient(90deg,var(--green1),var(--green2))' }} />}
              <span style={{ fontSize:20, filter:active?'none':'grayscale(0.5) opacity(0.5)', transform:active?'scale(1.12)':'scale(1)', transition:'all 0.2s' }}>{icon}</span>
              <span style={{ fontSize:9, fontWeight:active?800:500, color:active?'var(--green1)':'var(--text4)', letterSpacing:0.3 }}>{label.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
