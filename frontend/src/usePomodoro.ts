import { useEffect, useRef, useState } from 'react';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

type Mode = 'work' | 'break';

export default function usePomodoro(onWorkComplete: (startedAt: Date) => void) {
  const [mode, setMode] = useState<Mode>('work');
  const [secondsLeft, setSecondsLeft] = useState(WORK_MINUTES * 60);
  const [running, setRunning] = useState(false);
  const startRef = useRef<Date | null>(null);
  const completeRef = useRef(onWorkComplete);
  completeRef.current = onWorkComplete;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        // phase ended
        if (mode === 'work') {
          const startedAt = startRef.current ?? new Date();
          completeRef.current(startedAt);
          setMode('break');
          return BREAK_MINUTES * 60;
        } else {
          setMode('work');
          return WORK_MINUTES * 60;
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
    setSecondsLeft(WORK_MINUTES * 60);
    startRef.current = null;
  };

  return { mode, secondsLeft, running, start, pause, reset };
}
