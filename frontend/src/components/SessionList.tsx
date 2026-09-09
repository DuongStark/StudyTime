import { Session } from '../api';

interface SessionListProps {
  sessions: Session[];
}

export default function SessionList({ sessions }: SessionListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-theme dark:border-slate-700 dark:bg-slate-800">
      <h2 className="mb-4 text-lg font-bold text-slate-800 transition-theme dark:text-slate-100">
        Phiên học hôm nay
      </h2>
      {sessions.length === 0 ? (
        <p className="text-sm text-slate-400 transition-theme dark:text-slate-500">
          Chưa có phiên nào. Bắt đầu pomodoro đầu tiên!
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 transition-theme dark:divide-slate-700">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <div>
                <p className="font-medium text-slate-800 transition-theme dark:text-slate-100">
                  {s.subject}
                </p>
                <p className="text-xs text-slate-400 transition-theme dark:text-slate-500">
                  {new Date(s.startedAt).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 transition-theme dark:bg-indigo-950 dark:text-indigo-300">
                {s.durationMinutes} phút
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
