import { Stats as StatsType } from '../api';

interface StatsProps {
  stats: StatsType;
}

export default function Stats({ stats }: StatsProps) {
  const hours = Math.floor(stats.totalMinutes / 60);
  const minutes = stats.totalMinutes % 60;
  const timeText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} phút`;

  return (
    <section className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-bold text-slate-800">Thống kê hôm nay</h2>
      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-indigo-600">{timeText}</span>
        <span className="text-sm text-slate-500">/ {stats.totalSessions} phiên</span>
      </div>
      <h3 className="mb-2 text-sm font-medium text-slate-600">Theo môn học</h3>
      {stats.bySubject.length === 0 ? (
        <p className="text-sm text-slate-400">Chưa có dữ liệu</p>
      ) : (
        <ul className="space-y-2">
          {stats.bySubject.map((s) => {
            const percent = stats.totalMinutes
              ? Math.round((s.minutes / stats.totalMinutes) * 100)
              : 0;
            return (
              <li key={s.subject}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-700">{s.subject}</span>
                  <span className="text-slate-500">
                    {s.minutes} phút ({percent}%)
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-indigo-500"
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
