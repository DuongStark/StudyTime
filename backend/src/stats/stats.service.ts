import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(from?: string, to?: string) {
    const where: any = {};
    if (from) {
      where.startedAt = { ...(where.startedAt || {}), gte: new Date(`${from}T00:00:00`) };
    }
    if (to) {
      const end = new Date(`${to}T00:00:00`);
      end.setDate(end.getDate() + 1);
      where.startedAt = { ...(where.startedAt || {}), lt: end };
    }

    const sessions = await this.prisma.session.findMany({
      where,
      select: { subject: true, durationMinutes: true, startedAt: true },
      orderBy: { startedAt: 'asc' },
    });

    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

    const bySubject = new Map<string, number>();
    const byDate = new Map<string, number>();
    for (const s of sessions) {
      bySubject.set(s.subject, (bySubject.get(s.subject) || 0) + s.durationMinutes);
      const date = s.startedAt.toISOString().slice(0, 10);
      byDate.set(date, (byDate.get(date) || 0) + s.durationMinutes);
    }

    return {
      totalMinutes,
      totalSessions: sessions.length,
      bySubject: [...bySubject.entries()].map(([subject, minutes]) => ({ subject, minutes })),
      byDate: [...byDate.entries()].map(([date, minutes]) => ({ date, minutes })),
    };
  }
}
