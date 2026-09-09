import { useEffect } from 'react';
import usePomodoro, { PomodoroPreset } from '../usePomodoro';

interface TimerProps {
  preset: PomodoroPreset;
  onWorkComplete: (startedAt: Date, durationMinutes: number) => void;
  onStart?: () => void;
}

function ProgressRing({ progress, isWork }: { progress: number; isWork: boolean }) {
  const size = 260;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  return (
    <svg width={size} height={size} className="mx-auto -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="opacity-20"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={`transition-all duration-1000 ease-linear ${isWork ? 'text-white' : 'text-white'}`}
      />
    </svg>
  );
}

export default function Timer({ preset, onWorkComplete, onStart }: TimerProps) {
  const { mode, secondsLeft, running, start, pause, reset } = usePomodoro(preset, onWorkComplete);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const total = mode === 'work' ? preset.workMinutes * 60 : preset.breakMinutes * 60;
  const progress = ((total - secondsLeft) / total) * 100;

  const isWork = mode === 'work';

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (running) pause();
        else {
          onStart?.();
          start();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        reset();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [running, start, pause, reset, onStart]);

  const handleStart = () => {
    onStart?.();
    start();
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 text-center text-white shadow-2xl transition-all duration-700 sm:p-10 ${
        isWork
          ? 'bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700'
          : 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600'
      }`}
    >
      {/* decorative blur */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <p className="relative mb-4 text-xs font-semibold uppercase tracking-widest text-white/70 sm:text-sm">
        {isWork ? 'Thời gian học' : 'Giờ nghỉ'}
      </p>

      <div className="relative mx-auto mb-6">
        <ProgressRing progress={progress} isWork={isWork} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-mono text-6xl font-bold tabular-nums sm:text-7xl">{display}</p>
          <p className="mt-1 text-xs text-white/60 sm:text-sm">
            {isWork ? `${preset.workMinutes} phút học` : `${preset.breakMinutes} phút nghỉ`}
          </p>
        </div>
      </div>

      <div className="relative flex justify-center gap-3">
        {!running ? (
          <button
            onClick={handleStart}
            className="group rounded-2xl bg-white px-8 py-3 font-semibold text-slate-900 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
          >
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Bắt đầu
            </span>
          </button>
        ) : (
          <button
            onClick={pause}
            className="group rounded-2xl bg-white px-8 py-3 font-semibold text-slate-900 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
          >
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
              Tạm dừng
            </span>
          </button>
        )}
        <button
          onClick={reset}
          className="rounded-2xl border-2 border-white/40 px-6 py-3 font-semibold text-white transition-all hover:border-white/80 hover:bg-white/10 active:bg-white/20"
          title="Reset (R)"
        >
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Đặt lại
          </span>
        </button>
      </div>
    </div>
  );
}
