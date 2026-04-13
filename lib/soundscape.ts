// Web Audio API soundscapes — không cần file mp3
export type SoundType = 'rain' | 'ocean' | 'forest' | 'silence';

let ctx: AudioContext | null = null;
let nodes: AudioNode[] = [];

function getCtx(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
}

function makeNoise(buffer: AudioBuffer, color: 'white' | 'pink' | 'brown') {
  const data = buffer.getChannelData(0);
  if (color === 'white') {
    for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;
  } else if (color === 'pink') {
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i = 0; i < buffer.length; i++) {
      const w = Math.random() * 2 - 1;
      b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
      b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
      b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
      data[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)/4;
      b6=w*0.115926;
    }
  } else {
    let last = 0;
    for (let i = 0; i < buffer.length; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      data[i] = last * 3.5;
    }
  }
}

function createFilter(type: BiquadFilterType, freq: number, gain = 0) {
  const ac = getCtx();
  const f = ac.createBiquadFilter();
  f.type = type; f.frequency.value = freq; f.gain.value = gain;
  return f;
}

export function playRain(vol = 0.35) {
  stopSound();
  const ac = getCtx();
  const buf = ac.createBuffer(1, ac.sampleRate * 3, ac.sampleRate);
  makeNoise(buf, 'pink');
  const src = ac.createBufferSource();
  src.buffer = buf; src.loop = true;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, ac.currentTime);
  gain.gain.linearRampToValueAtTime(vol, ac.currentTime + 1.5);
  const hpf = createFilter('highpass', 400);
  const lpf = createFilter('lowpass', 3000);
  src.connect(hpf); hpf.connect(lpf); lpf.connect(gain); gain.connect(ac.destination);
  src.start();
  nodes = [src, gain];

  // Occasional drip effect
  const drip = setInterval(() => {
    if (!ctx) { clearInterval(drip); return; }
    const osc = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
    g2.gain.setValueAtTime(0.06, ctx.currentTime);
    g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(g2); g2.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  }, 800 + Math.random() * 1200);
  (nodes as any).__drip = drip;
}

export function playOcean(vol = 0.3) {
  stopSound();
  const ac = getCtx();
  const buf = ac.createBuffer(1, ac.sampleRate * 4, ac.sampleRate);
  makeNoise(buf, 'brown');
  const src = ac.createBufferSource();
  src.buffer = buf; src.loop = true;

  // Slow LFO for wave rhythm
  const lfo = ac.createOscillator();
  const lfoGain = ac.createGain();
  lfo.frequency.value = 0.12;
  lfoGain.gain.value = vol * 0.5;
  lfo.connect(lfoGain);

  const gain = ac.createGain();
  gain.gain.value = vol * 0.5;
  lfoGain.connect(gain.gain);

  const lpf = createFilter('lowpass', 600);
  src.connect(lpf); lpf.connect(gain); gain.connect(ac.destination);
  src.start(); lfo.start();
  nodes = [src, lfo, gain];
}

export function playForest(vol = 0.25) {
  stopSound();
  const ac = getCtx();
  // Soft wind
  const buf = ac.createBuffer(1, ac.sampleRate * 3, ac.sampleRate);
  makeNoise(buf, 'pink');
  const src = ac.createBufferSource();
  src.buffer = buf; src.loop = true;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, ac.currentTime);
  gain.gain.linearRampToValueAtTime(vol * 0.4, ac.currentTime + 2);
  const lpf = createFilter('lowpass', 800);
  const hpf = createFilter('highpass', 200);
  src.connect(hpf); hpf.connect(lpf); lpf.connect(gain); gain.connect(ac.destination);
  src.start();
  nodes = [src, gain];

  // Bird chirps
  const chirp = setInterval(() => {
    if (!ctx) { clearInterval(chirp); return; }
    const freq = 1200 + Math.random() * 800;
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + i * 120, ctx.currentTime + i * 0.12);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3 + i * 80, ctx.currentTime + i * 0.12 + 0.08);
      g2.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      g2.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * 0.12 + 0.02);
      g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.1);
      osc.connect(g2); g2.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.12);
    }
  }, 3000 + Math.random() * 4000);
  (nodes as any).__chirp = chirp;
}

export function stopSound() {
  nodes.forEach(n => {
    try { (n as any).stop?.(); n.disconnect(); } catch {}
  });
  if ((nodes as any).__drip) clearInterval((nodes as any).__drip);
  if ((nodes as any).__chirp) clearInterval((nodes as any).__chirp);
  nodes = [];
}

export function playSound(type: SoundType, vol = 0.3) {
  if (type === 'rain') playRain(vol);
  else if (type === 'ocean') playOcean(vol);
  else if (type === 'forest') playForest(vol);
  else stopSound();
}

export function playTick(phase: string) {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const g = ac.createGain();
    const freq = phase === 'inhale' ? 440 : phase === 'exhale' ? 330 : 380;
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, ac.currentTime);
    g.gain.linearRampToValueAtTime(0.12, ac.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.4);
    osc.connect(g); g.connect(ac.destination);
    osc.start(); osc.stop(ac.currentTime + 0.4);
  } catch {}
}
