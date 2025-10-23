// utils/audio.js
let audioCtx = null;

export function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  return audioCtx;
}

export async function resumeAudio() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') { 
    try { 
      await ctx.resume(); 
    } catch (e) {
      console.warn('Audio context resume failed:', e);
    }
  }
}

// Mobile-friendly audio initialization
export async function initAudioForMobile() {
  if (typeof window === 'undefined') return false;
  
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;
    
    // For mobile, we need user interaction to start audio
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    
    // Test audio with a very short, silent tone
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.001);
    
    return true;
  } catch (e) {
    console.warn('Mobile audio initialization failed:', e);
    return false;
  }
}

// ✅ Lejon start të planifikuar me startAt (sekonda absolute në AudioContext)
export function playHeartbeatBeep({
  startHz = 800,
  endHz = 600,
  durationMs = 90,
  volume = 0.35,
  wave = 'square',
  bandHz = 1400,
  q = 8,
  startAt = null,        // <- shtuar
} = {}) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const t0 = Math.max(now, startAt ?? now); // nëse jep startAt, përdore
  const dur = Math.max(0.02, durationMs / 1000);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.type = wave;
  osc.frequency.setValueAtTime(startHz, t0);
  osc.frequency.linearRampToValueAtTime(endHz, t0 + Math.min(0.03, dur * 0.4));

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(bandHz, t0);
  filter.Q.setValueAtTime(q, t0);

  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  osc.start(t0);
  osc.stop(t0 + dur);
}

// ✅ Chime "suksesi": dy pip-e ngjitëse
export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const t = ctx.currentTime;
  // pip 1 (pak më i butë)
  playHeartbeatBeep({
    startHz: 1000, endHz: 1400, durationMs: 90, volume: 0.35,
    wave: 'triangle', bandHz: 1200, q: 7, startAt: t,
  });
  // pip 2 (më i lartë, pas 120ms)
  playHeartbeatBeep({
    startHz: 1400, endHz: 1800, durationMs: 100, volume: 0.4,
    wave: 'triangle', bandHz: 1500, q: 7, startAt: t + 0.12,
  });
}

// Opsionale: klik i shkurtër për UI buttons
export function playClickTone() {
  playHeartbeatBeep({ startHz: 900, endHz: 700, durationMs: 50, volume: 0.2, wave: 'triangle', bandHz: 800, q: 6 });
}