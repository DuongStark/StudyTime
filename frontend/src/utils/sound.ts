let audioCtx: AudioContext | null = null;

export function beep(frequency = 660, durationMs = 300) {
  if (!audioCtx) audioCtx = new AudioContext();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.value = frequency;
  osc.type = 'sine';
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  gain.gain.value = 0.3;
  osc.start();
  osc.stop(audioCtx.currentTime + durationMs / 1000);
}

export async function requestNotificationPermission() {
  if (typeof Notification === 'undefined') return;
  if (Notification.permission === 'default') {
    try {
      await Notification.requestPermission();
    } catch {
      // ignore
    }
  }
}

export function showNotification(title: string, body: string) {
  if (typeof Notification === 'undefined') return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, { body });
    } catch {
      // ignore
    }
  }
}
