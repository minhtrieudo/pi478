'use client';

interface BreathingTreeProps {
  stage: number;
  streak: number;
  isWilting?: boolean;
}

export function BreathingTree({ stage, streak, isWilting = false }: BreathingTreeProps) {
  const wilt = isWilting ? 0.6 : 1;
  const leafColor = isWilting ? '#ca8a04' : '#22c55e';
  const darkLeaf  = isWilting ? '#92400e' : '#15803d';

  const trees = [
    // 0 — Hạt mầm (streak 0-3)
    <svg key={0} viewBox="0 0 120 140" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="60" cy="110" rx="30" ry="6" fill="rgba(0,0,0,0.2)" />
      <circle cx="60" cy="88" r="10" fill="#92400e" />
      <path d="M60,88 Q58,72 56,60 Q54,50 60,48" stroke={leafColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="56" cy="58" rx="8" ry="5" fill={leafColor} transform="rotate(-30,56,58)" opacity={wilt} />
      <ellipse cx="64" cy="52" rx="7" ry="4" fill={darkLeaf} transform="rotate(20,64,52)" opacity={wilt} />
      {[...Array(5)].map((_,i) => (
        <circle key={i} cx={45+i*8} cy={100+i%2*4} r="1.5" fill="#4ade80" opacity={0.4+i*0.1} />
      ))}
    </svg>,

    // 1 — Cây con (streak 4-7)
    <svg key={1} viewBox="0 0 120 140" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="60" cy="118" rx="35" ry="7" fill="rgba(0,0,0,0.2)" />
      <rect x="57" y="75" width="6" height="40" rx="3" fill="#92400e" />
      <ellipse cx="60" cy="62" rx="18" ry="22" fill={leafColor} opacity={wilt} />
      <ellipse cx="47" cy="72" rx="12" ry="14" fill={darkLeaf} opacity={wilt} />
      <ellipse cx="73" cy="72" rx="12" ry="14" fill={darkLeaf} opacity={wilt} />
      <circle cx="52" cy="60" r="4" fill="#4ade80" opacity={wilt * 0.7} />
      <circle cx="68" cy="58" r="3" fill="#86efac" opacity={wilt * 0.7} />
      <circle cx="60" cy="50" r="3.5" fill="#4ade80" opacity={wilt * 0.8} />
    </svg>,

    // 2 — Cây đã có lá (streak 8-14)
    <svg key={2} viewBox="0 0 120 140" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="60" cy="122" rx="40" ry="8" fill="rgba(0,0,0,0.2)" />
      <rect x="56" y="80" width="8" height="40" rx="4" fill="#78350f" />
      <rect x="48" y="95" width="12" height="5" rx="2" fill="#92400e" transform="rotate(-20,48,95)" />
      <rect x="60" y="90" width="12" height="5" rx="2" fill="#92400e" transform="rotate(20,72,90)" />
      <ellipse cx="60" cy="56" rx="26" ry="30" fill={leafColor} opacity={wilt} />
      <ellipse cx="40" cy="72" rx="18" ry="20" fill={darkLeaf} opacity={wilt} />
      <ellipse cx="80" cy="72" rx="18" ry="20" fill={darkLeaf} opacity={wilt} />
      <ellipse cx="60" cy="42" rx="16" ry="18" fill="#4ade80" opacity={wilt * 0.8} />
      {[38,50,60,70,82].map((cx,i) => (
        <circle key={i} cx={cx} cy={55+i*4} r="3" fill="#86efac" opacity={wilt * 0.6} />
      ))}
    </svg>,

    // 3 — Cây trưởng thành có hoa (streak 15-30)
    <svg key={3} viewBox="0 0 120 140" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="60" cy="126" rx="44" ry="9" fill="rgba(0,0,0,0.2)" />
      <rect x="55" y="82" width="10" height="42" rx="5" fill="#78350f" />
      <rect x="38" y="100" width="17" height="6" rx="3" fill="#92400e" transform="rotate(-25,38,100)" />
      <rect x="65" y="95" width="17" height="6" rx="3" fill="#92400e" transform="rotate(25,82,95)" />
      <ellipse cx="60" cy="52" rx="30" ry="35" fill={leafColor} opacity={wilt} />
      <ellipse cx="36" cy="70" rx="22" ry="25" fill={darkLeaf} opacity={wilt} />
      <ellipse cx="84" cy="70" rx="22" ry="25" fill={darkLeaf} opacity={wilt} />
      <ellipse cx="60" cy="34" rx="18" ry="20" fill="#4ade80" opacity={wilt * 0.9} />
      {isWilting ? null : [
        {cx:42,cy:48,c:'#f9a8d4'},{cx:74,cy:52,c:'#fde68a'},
        {cx:55,cy:34,c:'#f9a8d4'},{cx:68,cy:40,c:'#fbbf24'},
        {cx:48,cy:62,c:'#fde68a'},{cx:72,cy:65,c:'#f9a8d4'},
      ].map((f,i) => (
        <g key={i}>
          <circle cx={f.cx} cy={f.cy} r="5" fill={f.c} opacity="0.9" />
          <circle cx={f.cx} cy={f.cy} r="2" fill="#fbbf24" />
        </g>
      ))}
    </svg>,

    // 4 — Cây ra quả (streak 31-60)
    <svg key={4} viewBox="0 0 120 140" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="60" cy="128" rx="46" ry="9" fill="rgba(0,0,0,0.2)" />
      <rect x="54" y="84" width="12" height="42" rx="6" fill="#5c3317" />
      <rect x="32" y="104" width="22" height="7" rx="3" fill="#78350f" transform="rotate(-28,32,104)" />
      <rect x="66" y="98" width="22" height="7" rx="3" fill="#78350f" transform="rotate(28,88,98)" />
      <ellipse cx="60" cy="50" rx="34" ry="38" fill={leafColor} opacity={wilt} />
      <ellipse cx="32" cy="68" rx="25" ry="28" fill={darkLeaf} opacity={wilt} />
      <ellipse cx="88" cy="68" rx="25" ry="28" fill={darkLeaf} opacity={wilt} />
      <ellipse cx="60" cy="28" rx="20" ry="24" fill="#4ade80" opacity={wilt * 0.9} />
      {isWilting ? null : [
        {cx:40,cy:52,c:'#ef4444'},{cx:72,cy:48,c:'#f97316'},
        {cx:56,cy:36,c:'#ef4444'},{cx:44,cy:68,c:'#f97316'},
        {cx:76,cy:64,c:'#ef4444'},{cx:62,cy:58,c:'#f97316'},
      ].map((f,i) => (
        <circle key={i} cx={f.cx} cy={f.cy} r="5" fill={f.c} opacity="0.9" />
      ))}
      {[38,50,64,78].map((cx,i) => (
        <circle key={i} cx={cx} cy={56+i*5} r="2.5" fill="#86efac" opacity="0.5" />
      ))}
    </svg>,

    // 5 — Cổ thụ hùng vĩ (streak 61+)
    <svg key={5} viewBox="0 0 120 140" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="60" cy="130" rx="50" ry="10" fill="rgba(0,0,0,0.3)" />
      <rect x="52" y="85" width="16" height="44" rx="8" fill="#44180a" />
      <rect x="28" y="108" width="24" height="8" rx="4" fill="#5c3317" transform="rotate(-30,28,108)" />
      <rect x="68" y="102" width="24" height="8" rx="4" fill="#5c3317" transform="rotate(30,92,102)" />
      <rect x="24" y="120" width="16" height="6" rx="3" fill="#78350f" transform="rotate(-20,24,120)" />
      <rect x="80" y="118" width="16" height="6" rx="3" fill="#78350f" transform="rotate(20,96,118)" />
      <ellipse cx="60" cy="46" rx="38" ry="44" fill={leafColor} opacity={wilt} />
      <ellipse cx="28" cy="66" rx="28" ry="32" fill={darkLeaf} opacity={wilt} />
      <ellipse cx="92" cy="66" rx="28" ry="32" fill={darkLeaf} opacity={wilt} />
      <ellipse cx="60" cy="22" rx="24" ry="28" fill="#4ade80" opacity={wilt * 0.9} />
      <ellipse cx="38" cy="42" rx="16" ry="18" fill="#86efac" opacity={wilt * 0.7} />
      <ellipse cx="82" cy="40" rx="16" ry="18" fill="#86efac" opacity={wilt * 0.7} />
      {isWilting ? null : <>
        {[{cx:36,cy:44},{cx:80,cy:38},{cx:56,cy:22},{cx:66,cy:30},{cx:44,cy:60},{cx:74,cy:56},{cx:60,cy:48}].map((p,i) => (
          <g key={i}>
            <circle cx={p.cx} cy={p.cy} r="4.5" fill={i%2===0?'#fde68a':'#f9a8d4'} opacity="0.9" />
            <circle cx={p.cx} cy={p.cy} r="1.8" fill="#fbbf24" />
          </g>
        ))}
        {[{cx:42,cy:52},{cx:70,cy:46},{cx:56,cy:36},{cx:46,cy:66},{cx:74,cy:62}].map((p,i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r="4" fill={i%2===0?'#ef4444':'#f97316'} opacity="0.85" />
        ))}
        <circle cx="36" cy="50" r="2" fill="#fde68a" opacity="0.6" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
        <circle cx="82" cy="44" r="2" fill="#fde68a" opacity="0.6" style={{ animation: 'pulse 2.5s ease-in-out infinite' }} />
        <circle cx="60" cy="28" r="2.5" fill="#fde68a" opacity="0.7" style={{ animation: 'pulse 1.8s ease-in-out infinite' }} />
      </>}
    </svg>,
  ];

  const stageNames = ['Hạt mầm', 'Cây con', 'Cây xanh', 'Cây trưởng thành', 'Cây ra quả', 'Cổ thụ hùng vĩ'];
  const stageColors = ['#ca8a04','#22c55e','#16a34a','#15803d','#f97316','#fbbf24'];
  const nextMilestones = [4, 8, 15, 31, 61];
  const clampedStage = Math.min(stage, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 160, height: 180, position: 'relative' }}>
        {trees[clampedStage]}
        {isWilting && (
          <div style={{
            position: 'absolute', top: 0, right: 0,
            background: 'rgba(202,138,4,0.15)', border: '1px solid rgba(202,138,4,0.4)',
            borderRadius: 8, padding: '3px 8px', fontSize: 10, fontWeight: 700, color: '#ca8a04',
          }}>
            🍂 Đang héo
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: stageColors[clampedStage], marginBottom: 2 }}>
          {stageNames[clampedStage]}
        </p>
        <p style={{ fontSize: 11, color: 'rgba(192,132,252,0.6)' }}>
          🔥 {streak} ngày streak
        </p>
        {clampedStage < 5 && (
          <p style={{ fontSize: 10, color: 'rgba(192,132,252,0.4)', marginTop: 2 }}>
            Tiếp theo: {nextMilestones[clampedStage]} ngày
          </p>
        )}
      </div>
    </div>
  );
}
