import { useCallback, useEffect, useState } from 'react';
import Timer from './components/Timer';
import Stats from './components/Stats';
import SessionList from './components/SessionList';
import { Session, Stats as StatsType, createSession, getSessions, getStats } from './api';
import { requestNotificationPermission } from './utils/sound';
import type { PomodoroPreset } from './usePomodoro';

const PRESETS: { label: string; work: number; break: number }[] = [
  { label: '25 / 5', work: 25, break: 5 },
  { label: '30 / 5', work: 30, break: 5 },
  { label: '50 / 10', work: 50, break: 10 },
];

const PRESET_KEY = 'study-timer-preset';
const DARK_KEY = 'study-timer-dark';

function getInitialDark(): boolean {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem(DARK_KEY);
  if (saved !== null) return saved === 'true';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function App() {
  const [subject, setSubject] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<StatsType | null>(null);
  const [error, setError] = useState('');
  const [dark, setDark] = useState(getInitialDark);
  const [presetIdx, setPresetIdx] = useState<number>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(PRESET_KEY) : null;
    const idx = PRESETS.findIndex((p) => p.label === saved);
    return idx >= 0 ? idx : 0;
  });

  const preset: PomodoroPreset = {
    workMinutes: PRESETS[presetIdx].work,
    breakMinutes: PRESETS[presetIdx].break,
  };

  const today = new Date().toISOString().slice(0, 10);

  // apply dark class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem(DARK_KEY, String(dark));
  }, [dark]);

  // auto-hide error after 3s
  useEffect(() => {
    if (!error) return;
    const id = setTimeout(() => setError(''), 3000);
    return () => clearTimeout(id);
  }, [error]);

  const refresh = useCallback(async () => {
    try {
      const [s, st] = await Promise.all([
        getSessions(today),
        getStats(today, today),
      ]);
      setSessions(s);
      setStats(st);
      setError('');
    } catch {
      setError('Không kết nối được server. Hãy chạy backend ở cổng 3001.');
    }
  }, [today]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleWorkComplete = useCallback(
    async (startedAt: Date, durationMinutes: number) => {
      const currentSubject = subject.trim() || 'Tổng';
      try {
        await createSession({
          subject: currentSubject,
          startedAt: startedAt.toISOString(),
          endedAt: new Date().toISOString(),
          durationMinutes,
        });
        refresh();
      } catch {
        setError('Lưu phiên học thất bại');
      }
    },
    [subject, refresh],
  );

  const handlePresetChange = (idx: number) => {
    setPresetIdx(idx);
    localStorage.setItem(PRESET_KEY, PRESETS[idx].label);
  };

  const handleStart = () => {
    requestNotificationPermission();
  };

  const toggleDark = () => setDark((d) => !d);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="py-4 text-slate-900 dark:text-slate-100">
        <div className="mx-auto max-w-3xl px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">Study Timer</h1>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Pomodoro {PRESETS[presetIdx].label} phút
              </p>
            </div>
            <button
              onClick={toggleDark}
              title="Dark mode (D)"
              className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Môn học
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="VD: Toán, Tiếng Anh..."
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Thời lượng (học / nghỉ)
            </label>
            <select
              value={presetIdx}
              onChange={(e) => handlePresetChange(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {PRESETS.map((p, i) => (
                <option key={p.label} value={i}>
                  {p.label} phút
                </option>
              ))}
            </select>
          </div>
        </div>

        <Timer
          preset={preset}
          onWorkComplete={handleWorkComplete}
          onStart={handleStart}
        />

        <div className="mt-6 grid gap-6 sm:mt-8 md:grid-cols-2">
          {stats && <Stats stats={stats} />}
          <SessionList sessions={sessions} />
        </div>

        <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
          <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-700 dark:bg-slate-800">Space</kbd>
          {' '}bắt đầu / dừng ·{' '}
          <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-700 dark:bg-slate-800">R</kbd>
          {' '}đặt lại ·{' '}
          <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-700 dark:bg-slate-800">D</kbd>
          {' '}dark mode
        </p>
      </main>
    </div>
  );
}
