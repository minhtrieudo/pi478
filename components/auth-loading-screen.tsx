"use client";
import { usePiAuth } from "@/contexts/pi-auth-context";
import { useEffect, useState } from "react";

const LINES = ["Mình đang tìm bạn...", "Sắp gặp nhau rồi...", "Cây của bạn đang chờ...", "Một chút nữa thôi..."];

export function AuthLoadingScreen() {
  const { authMessage, hasError, reinitialize } = usePiAuth();
  const [li, setLi] = useState(0);
  useEffect(() => { if (hasError) return; const t = setInterval(() => setLi(i => (i+1)%LINES.length), 2200); return () => clearInterval(t); }, [hasError]);

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24, padding:32, fontFamily:'system-ui,sans-serif' }}>
      <style>{`@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}} @keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} *{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ animation:'breathe 2.5s ease-in-out infinite' }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="35" fill="none" stroke="var(--green4)" strokeWidth="3"/>
          <circle cx="40" cy="40" r="25" fill="var(--green3)" opacity="0.5"/>
          <circle cx="40" cy="40" r="14" fill="var(--green2)" opacity="0.8"/>
        </svg>
      </div>
      <div style={{ textAlign:'center' }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:'var(--text1)', marginBottom:6 }}>PiBreath</h1>
        <p style={{ fontSize:13, color:'var(--text3)' }}>người bạn hít thở của bạn 🌿</p>
      </div>
      {hasError ? (
        <div style={{ textAlign:'center', maxWidth:280 }}>
          <p style={{ fontSize:14, color:'#c43b3b', marginBottom:16, lineHeight:1.6 }}>{authMessage || 'Không kết nối được. Thử lại nhé?'}</p>
          <button onClick={reinitialize} style={{ padding:'12px 28px', borderRadius:16, border:'none', cursor:'pointer', background:'var(--green1)', color:'white', fontSize:14, fontWeight:800 }}>Thử lại</button>
        </div>
      ) : (
        <>
          <p key={li} style={{ fontSize:14, color:'var(--text3)', animation:'fadeUp 0.4s ease-out', fontStyle:'italic' }}>{LINES[li]}</p>
          <div style={{ width:32, height:32, borderRadius:'50%', border:'3px solid var(--green4)', borderTopColor:'var(--green1)', animation:'spin 0.8s linear infinite' }} />
        </>
      )}
    </div>
  );
}
