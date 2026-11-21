// Small original harbor tones, synthesized locally with WebAudio. No samples or network assets.
export function createHarborAudio() {
  const Audio = window.AudioContext || window.webkitAudioContext;
  let context = null;
  let muted = false;
  let master = null;
  let drone = [];
  const scale = [220, 261.63, 329.63, 392, 329.63, 261.63];
  let noteIndex = 0;

  function ensure() {
    if (!Audio) return null;
    if (!context) {
      context = new Audio();
      master = context.createGain(); master.gain.value = muted ? 0 : .42; master.connect(context.destination);
      const low = context.createBiquadFilter(); low.type = 'lowpass'; low.frequency.value = 520; low.connect(master);
      [110, 164.81].forEach((frequency, i) => {
        const osc = context.createOscillator(); const gain = context.createGain();
        osc.type = i ? 'sine' : 'triangle'; osc.frequency.value = frequency; gain.gain.value = i ? .035 : .022;
        osc.connect(gain); gain.connect(low); osc.start(); drone.push({osc,gain});
      });
    }
    if (context.state === 'suspended') context.resume().catch(() => {});
    return context;
  }
  function chime(frequency, length = .42, type = 'sine', volume = .12) {
    const ctx = ensure(); if (!ctx || muted) return;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + .025);
    gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + length);
    osc.connect(gain); gain.connect(master); osc.start(); osc.stop(ctx.currentTime + length + .04);
  }
  return {
    start(level = 0) {
      ensure(); noteIndex = level * 2;
      if (drone.length) {
        drone[0].osc.frequency.setTargetAtTime([110, 98, 123.47][level] || 110, context.currentTime, .8);
        drone[1].osc.frequency.setTargetAtTime([164.81, 146.83, 185][level] || 164.81, context.currentTime, .8);
      }
    },
    found() { chime(scale[noteIndex % scale.length], .55, 'sine', .10); noteIndex += 1; setTimeout(() => chime(scale[noteIndex % scale.length] * 1.5, .48, 'sine', .055), 85); },
    wrong() { chime(155, .28, 'triangle', .07); },
    complete() { [392, 493.88, 587.33].forEach((n,i) => setTimeout(() => chime(n, .72, 'sine', .095), i*145)); },
    toggle() {
      muted = !muted;
      if (context && master) master.gain.setTargetAtTime(muted ? 0 : .42, context.currentTime, .04);
      if (!muted) ensure();
      return muted;
    },
    get muted() { return muted; },
  };
}
