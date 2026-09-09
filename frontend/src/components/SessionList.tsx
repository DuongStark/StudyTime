import { Session } from '../api';

interface SessionListProps {
  sessions: Session[];
}

export default function SessionList({ sessions }: SessionListProps) {
  return (
    <section className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-bold text-slate-800">Phiên học hôm nay</h2>
      {sessions.length === 0 ? (
        <p className="text-sm text-slate-400">Chưa có phiên nào. Bắt đầu pomodoro đầu tiên!</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {sessions.map((s) => (
            <li key={s.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-slate-800">{s.subject}</p>
                <p className="text-xs text-slate-400">
                  {new Date(s.startedAt).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600">
                {s.durationMinutes} phút
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
