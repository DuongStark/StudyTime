import { useEffect, useState } from 'react';
import { Stats as StatsType, getStats } from '../api';

export default function Statistics() {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [error, setError] = useState('');

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats(today, today);
        setStats(data);
        setError('');
      } catch {
        setError('Không tải được thống kê');
      }
    };
    fetchStats();
  }, [today]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500 dark:text-slate-400">Đang tải...</div>
      </div>
    );
  }

  const hours = Math.floor(stats.totalMinutes / 60);
  const minutes = stats.totalMinutes % 60;
  const timeText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} phút`;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Thống kê hôm nay
      </h2>

      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-4xl font-bold text-blue-600">{timeText}</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            / {stats.totalSessions} phiên
          </span>
        </div>

        <h3 className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-300">
          Theo môn học
        </h3>
        {stats.bySubject.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500">Chưa có dữ liệu</p>
        ) : (
          <ul className="space-y-3">
            {stats.bySubject.map((s) => {
              const percent = stats.totalMinutes
                ? Math.round((s.minutes / stats.totalMinutes) * 100)
                : 0;
              return (
                <li key={s.subject}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {s.subject}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {s.minutes} phút ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
