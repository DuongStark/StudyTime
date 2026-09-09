import usePomodoro, { PomodoroPreset } from '../usePomodoro';

interface TimerProps {
  preset: PomodoroPreset;
  onWorkComplete: (startedAt: Date, durationMinutes: number) => void;
  onStart?: () => void;
}

export default function Timer({ preset, onWorkComplete, onStart }: TimerProps) {
  const { mode, secondsLeft, running, start, pause, reset } = usePomodoro(preset, onWorkComplete);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const total = mode === 'work' ? preset.workMinutes * 60 : preset.breakMinutes * 60;
  const progress = ((total - secondsLeft) / total) * 100;

  const isWork = mode === 'work';

  const handleStart = () => {
    onStart?.();
    start();
  };

  return (
    <div
      className={`rounded-2xl p-8 text-center text-white shadow-lg ${
        isWork ? 'bg-indigo-600' : 'bg-emerald-600'
      }`}
    >
      <p className="text-sm font-medium uppercase tracking-wider opacity-80">
        {isWork ? 'Học tập' : 'Nghỉ ngơi'}
      </p>
      <p className="my-4 text-7xl font-bold tabular-nums">{display}</p>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-white/20">
        <div className="h-full bg-white transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex justify-center gap-3">
        {!running ? (
          <button
            onClick={handleStart}
            className="rounded-lg bg-white px-6 py-2 font-semibold text-slate-900 hover:bg-slate-100"
          >
            Bắt đầu
          </button>
        ) : (
          <button
            onClick={pause}
            className="rounded-lg bg-white px-6 py-2 font-semibold text-slate-900 hover:bg-slate-100"
          >
            Tạm dừng
          </button>
        )}
        <button
          onClick={reset}
          className="rounded-lg border border-white/40 px-6 py-2 font-semibold hover:bg-white/10"
        >
          Đặt lại
        </button>
      </div>
    </div>
  );
}
