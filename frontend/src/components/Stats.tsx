import { Stats as StatsType } from '../api';

interface StatsProps {
  stats: StatsType;
}

export default function Stats({ stats }: StatsProps) {
  const hours = Math.floor(stats.totalMinutes / 60);
  const minutes = stats.totalMinutes % 60;
  const timeText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} phút`;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-theme dark:border-slate-700 dark:bg-slate-800">
      <h2 className="mb-4 text-lg font-bold text-slate-800 transition-theme dark:text-slate-100">
        Thống kê hôm nay
      </h2>
      <div className="mb-5 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-indigo-600">
          {timeText}
        </span>
        <span className="text-sm text-slate-500 transition-theme dark:text-slate-400">
          / {stats.totalSessions} phiên
        </span>
      </div>
      <h3 className="mb-3 text-sm font-medium text-slate-600 transition-theme dark:text-slate-300">
        Theo môn học
      </h3>
      {stats.bySubject.length === 0 ? (
        <p className="text-sm text-slate-400 transition-theme dark:text-slate-500">Chưa có dữ liệu</p>
      ) : (
        <ul className="space-y-3">
          {stats.bySubject.map((s) => {
            const percent = stats.totalMinutes
              ? Math.round((s.minutes / stats.totalMinutes) * 100)
              : 0;
            return (
              <li key={s.subject}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium text-slate-700 transition-theme dark:text-slate-200">
                    {s.subject}
                  </span>
                  <span className="text-slate-500 transition-theme dark:text-slate-400">
                    {s.minutes} phút ({percent}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 transition-theme dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
