import { useCallback, useEffect, useState } from 'react';
import Timer from './components/Timer';
import Stats from './components/Stats';
import SessionList from './components/SessionList';
import { Session, Stats as StatsType, createSession, getSessions, getStats } from './api';

export default function App() {
  const [subject, setSubject] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<StatsType | null>(null);
  const [error, setError] = useState('');

  const today = new Date().toISOString().slice(0, 10);

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
    async (startedAt: Date) => {
      const currentSubject = subject.trim() || 'Tổng';
      try {
        await createSession({
          subject: currentSubject,
          startedAt: startedAt.toISOString(),
          endedAt: new Date().toISOString(),
          durationMinutes: 25,
        });
        refresh();
      } catch {
        setError('Lưu phiên học thất bại');
      }
    },
    [subject, refresh],
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-indigo-600 py-6 text-center text-white">
        <h1 className="text-3xl font-bold">Study Timer</h1>
        <p className="mt-1 text-indigo-200">Pomodoro 25/5 - Bấm giờ học tập</p>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4">
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

        <Timer onWorkComplete={handleWorkComplete} />

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {stats && <Stats stats={stats} />}
          <SessionList sessions={sessions} />
        </div>
      </main>
    </div>
  );
}
