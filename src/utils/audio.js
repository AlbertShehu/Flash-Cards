// utils/audio.js
// Lazy AudioContext + unlock për mobile/iOS
let ctx = null;

function getAC() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  return ctx;
}

export function getAudioContext() {
  return getAC();
}

export async function unlockAudio() {
  const ac = getAC();
  if (!ac) return false;

  // iOS / mobile: duam ta vendosim në "running"
  if (ac.state === "suspended") {
    try { 
      await ac.resume(); 
    } catch (e) {
      console.warn('Audio context resume failed:', e);
    }
  }

  // "Silent one-sample" për të hequr kufizimin në iOS
  try {
    const buffer = ac.createBuffer(1, 1, ac.sampleRate);
    const src = ac.createBufferSource();
    src.buffer = buffer;
    src.connect(ac.destination);
    src.start(0);
    src.stop(0);
    src.disconnect();
  } catch (e) {
    console.warn('Silent buffer creation failed:', e);
  }
  
  return ac.state === "running";
}

export async function resumeAudio() {
  return await unlockAudio();
}

// Mobile-friendly audio initialization (backward compatibility)
export async function initAudioForMobile() {
  return await unlockAudio();
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

// Beep i përgjithshëm
export async function playTone(freq = 1000, durationMs = 200, volume = 0.4, type = "sine") {
  const ac = getAC();
  if (!ac) return;

  // Sigurohu që është running
  if (ac.state !== "running") {
    try { 
      await ac.resume(); 
    } catch (e) {
      console.warn('Audio context resume failed:', e);
    }
  }

  const osc = ac.createOscillator();
  const gain = ac.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0, ac.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ac.currentTime + 0.01);
  // mos e çoje në 0 fiks (disa mobile nuk e pëlqejnë 0 eksponencial)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + durationMs / 1000);

  osc.connect(gain);
  gain.connect(ac.destination);

  osc.start();
  osc.stop(ac.currentTime + durationMs / 1000);

  // pastrimi
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}

// convenience functions
export const playSuccess = () => playTone(1100, 220, 0.5, "triangle");
export const playClick = () => playTone(700, 80, 0.25, "square");

// Opsionale: klik i shkurtër për UI buttons (backward compatibility)
export function playClickTone() {
  playClick();
}