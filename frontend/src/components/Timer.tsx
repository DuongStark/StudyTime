import { useEffect } from 'react';
import usePomodoro, { PomodoroPreset } from '../usePomodoro';
import { Play, Pause, ArrowCounterClockwise } from '@phosphor-icons/react';

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
      className={`relative rounded-xl p-6 text-center text-white transition-colors sm:p-10 ${
        isWork ? 'bg-blue-600' : 'bg-slate-600'
      }`}
    >
      <p className="mb-4 text-sm font-medium text-white/80">
        {isWork ? 'Thời gian học' : 'Giờ nghỉ'}
      </p>

      <div className="relative mx-auto mb-6">
        <ProgressRing progress={progress} isWork={isWork} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-mono text-6xl font-bold sm:text-7xl">{display}</p>
          <p className="mt-1 text-sm text-white/70">
            {isWork ? `${preset.workMinutes} phút học` : `${preset.breakMinutes} phút nghỉ`}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        {!running ? (
          <button
            onClick={handleStart}
            className="rounded-xl bg-white px-8 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-100"
          >
            <span className="flex items-center gap-2">
              <Play size={18} weight="fill" />
              Bắt đầu
            </span>
          </button>
        ) : (
          <button
            onClick={pause}
            className="rounded-xl bg-white px-8 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-100"
          >
            <span className="flex items-center gap-2">
              <Pause size={18} weight="fill" />
              Tạm dừng
            </span>
          </button>
        )}
        <button
          onClick={reset}
          className="rounded-xl border-2 border-white/50 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          title="Reset (R)"
        >
          <span className="flex items-center gap-2">
            <ArrowCounterClockwise size={18} weight="bold" />
            Đặt lại
          </span>
        </button>
      </div>
    </div>
  );
}
