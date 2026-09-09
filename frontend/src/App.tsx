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

export default function App() {
  const [subject, setSubject] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<StatsType | null>(null);
  const [error, setError] = useState('');
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

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-indigo-600 py-6 text-center text-white">
        <h1 className="text-3xl font-bold">Study Timer</h1>
        <p className="mt-1 text-indigo-200">Pomodoro {PRESETS[presetIdx].label} - Bấm giờ học tập</p>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Môn học
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="VD: Toán, Tiếng Anh..."
              className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Thời lượng (học / nghỉ)
            </label>
            <select
              value={presetIdx}
              onChange={(e) => handlePresetChange(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-indigo-500"
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

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {stats && <Stats stats={stats} />}
          <SessionList sessions={sessions} />
        </div>
      </main>
    </div>
  );
}
