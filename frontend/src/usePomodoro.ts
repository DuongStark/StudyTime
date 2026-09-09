import { useEffect, useRef, useState } from 'react';
import { beep, showNotification } from './utils/sound';

export type Mode = 'work' | 'break';

export interface PomodoroPreset {
  workMinutes: number;
  breakMinutes: number;
}

export default function usePomodoro(
  preset: PomodoroPreset,
  onWorkComplete: (startedAt: Date, durationMinutes: number) => void,
) {
  const [mode, setMode] = useState<Mode>('work');
  const [secondsLeft, setSecondsLeft] = useState(preset.workMinutes * 60);
  const [running, setRunning] = useState(false);
  const startRef = useRef<Date | null>(null);
  const completeRef = useRef(onWorkComplete);
  completeRef.current = onWorkComplete;

  const presetRef = useRef(preset);
  presetRef.current = preset;

  // reset timer khi đổi preset
  useEffect(() => {
    setRunning(false);
    setMode('work');
    setSecondsLeft(preset.workMinutes * 60);
    startRef.current = null;
  }, [preset.workMinutes, preset.breakMinutes]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        // phase ended
        beep();
        if (mode === 'work') {
          const startedAt = startRef.current ?? new Date();
          const workMin = presetRef.current.workMinutes;
          completeRef.current(startedAt, workMin);
          showNotification('Hết giờ học!', `Nghỉ ${presetRef.current.breakMinutes} phút nhé.`);
          setMode('break');
          return presetRef.current.breakMinutes * 60;
        } else {
          showNotification('Hết giờ nghỉ!', 'Bắt đầu phiên học mới nào.');
          setMode('work');
          return presetRef.current.workMinutes * 60;
        }
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, mode]);

  const start = () => {
    if (!startRef.current) startRef.current = new Date();
    setRunning(true);
  };

  const pause = () => setRunning(false);

  const reset = () => {
    setRunning(false);
    setMode('work');
    setSecondsLeft(presetRef.current.workMinutes * 60);
    startRef.current = null;
  };

  return { mode, secondsLeft, running, start, pause, reset };
}
