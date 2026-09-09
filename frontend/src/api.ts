export interface Session {
  id: number;
  subject: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  createdAt: string;
}

export interface Stats {
  totalMinutes: number;
  totalSessions: number;
  bySubject: { subject: string; minutes: number }[];
  byDate: { date: string; minutes: number }[];
}

const API = '/api';

export async function createSession(data: {
  subject: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
}): Promise<Session> {
  const res = await fetch(`${API}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Lưu phiên học thất bại');
  return res.json();
}

export async function getSessions(date?: string): Promise<Session[]> {
  const query = date ? `?date=${date}` : '';
  const res = await fetch(`${API}/sessions${query}`);
  if (!res.ok) throw new Error('Tải phiên học thất bại');
  return res.json();
}

export async function getStats(from?: string, to?: string): Promise<Stats> {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const res = await fetch(`${API}/stats?${params}`);
  if (!res.ok) throw new Error('Tải thống kê thất bại');
  return res.json();
}
