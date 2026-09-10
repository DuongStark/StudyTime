import { useCallback, useEffect, useState } from 'react';
import Timer from '../components/Timer';
import { Session, Stats as StatsType, createSession, getSessions, getStats } from '../api';
import { requestNotificationPermission } from '../utils/sound';
import type { PomodoroPreset } from '../usePomodoro';
import { BookOpen, Clock } from '@phosphor-icons/react';

const PRESETS: { label: string; work: number; break: number }[] = [
  { label: '25 / 5', work: 25, break: 5 },
  { label: '30 / 5', work: 30, break: 5 },
  { label: '50 / 10', work: 50, break: 10 },
];

const PRESET_KEY = 'study-timer-preset';

export default function Dashboard() {
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

  const totalMinutes = stats?.totalMinutes || 0;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const timeText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} phút`;
  const sessionCount = stats?.totalSessions || 0;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {/* 2-column layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Timer section */}
        <div className="lg:col-span-3 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
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
        </div>

        {/* Right: Stats & Sessions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                <Clock size={18} weight="fill" />
                <span className="text-xs font-medium">Hôm nay</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{timeText}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                <BookOpen size={18} weight="fill" />
                <span className="text-xs font-medium">Phiên học</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{sessionCount}</div>
            </div>
          </div>

          {/* Sessions list */}
          <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Phiên học hôm nay
              </h3>
            </div>
            <div className="p-4">
              {sessions.length === 0 ? (
                <div className="py-8 text-center">
                  <BookOpen size={40} weight="duotone" className="mx-auto mb-3 text-slate-400 dark:text-slate-500" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Chưa có phiên học nào
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Bắt đầu pomodoro đầu tiên!
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {sessions.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {s.subject}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {new Date(s.startedAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {s.durationMinutes} phút
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
