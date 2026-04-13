'use client';

interface MoodPoint { day: string; before: number; after: number; }

interface MoodGraphProps { data: MoodPoint[]; }

const MOODS = ['','😰','😟','😐','🙂','😌'];

export function MoodGraph({ data }: MoodGraphProps) {
  const days = ['CN','T2','T3','T4','T5','T6','T7'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '14px 16px', borderRadius: 18, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(192,132,252,0.7)', marginBottom: 10, letterSpacing: 0.5 }}>TÂM TRẠNG 7 NGÀY QUA</p>

        {/* Bar chart */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80, marginBottom: 8 }}>
          {data.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                {d.after > 0 && (
                  <div style={{ width: '100%', height: d.after * 14, borderRadius: 4, background: 'linear-gradient(180deg, #10b981, #059669)', opacity: 0.9, minHeight: 4 }} />
                )}
                {d.before > 0 && (
                  <div style={{ width: '100%', height: d.before * 14, borderRadius: 4, background: 'rgba(168,85,247,0.4)', minHeight: 4 }} />
                )}
                {d.before === 0 && d.after === 0 && (
                  <div style={{ width: '100%', height: 4, borderRadius: 4, background: 'rgba(168,85,247,0.1)' }} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Day labels */}
        <div style={{ display: 'flex', gap: 6 }}>
          {data.map((d, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'rgba(192,132,252,0.5)', fontWeight: 600 }}>
              {d.day}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(168,85,247,0.4)' }} />
            <span style={{ fontSize: 11, color: 'rgba(192,132,252,0.6)' }}>Trước</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: '#10b981' }} />
            <span style={{ fontSize: 11, color: 'rgba(192,132,252,0.6)' }}>Sau</span>
          </div>
        </div>
      </div>

      {/* Recent sessions */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(192,132,252,0.6)', marginBottom: 10, letterSpacing: 0.5 }}>PHIÊN GẦN ĐÂY</p>
        {data.filter(d => d.before > 0).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'rgba(192,132,252,0.3)', fontSize: 13 }}>
            Chưa có dữ liệu. Bắt đầu tập để theo dõi tâm trạng!
          </div>
        ) : data.filter(d => d.before > 0).map((d, i) => {
          const improved = d.after > d.before;
          const same = d.after === d.before;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(168,85,247,0.1)', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{d.day}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{MOODS[d.before]}</span>
                <span style={{ fontSize: 13, color: improved ? '#10b981' : same ? 'rgba(192,132,252,0.5)' : '#f87171' }}>
                  {improved ? '↑' : same ? '→' : '↓'}
                </span>
                <span style={{ fontSize: 18 }}>{MOODS[d.after]}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: improved ? '#10b981' : same ? 'rgba(192,132,252,0.5)' : '#f87171' }}>
                {improved ? `+${d.after - d.before}` : same ? '=' : `${d.after - d.before}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
