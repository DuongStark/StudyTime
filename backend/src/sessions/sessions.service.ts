import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { subject: string; startedAt: string; endedAt: string; durationMinutes: number }) {
    return this.prisma.session.create({
      data: {
        subject: data.subject,
        startedAt: new Date(data.startedAt),
        endedAt: new Date(data.endedAt),
        durationMinutes: data.durationMinutes,
      },
    });
  }

  async findAll(date?: string) {
    if (!date) {
      return this.prisma.session.findMany({ orderBy: { startedAt: 'desc' }, take: 50 });
    }
    const start = new Date(`${date}T00:00:00`);
    if (isNaN(start.getTime())) return [];
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return this.prisma.session.findMany({
      where: { startedAt: { gte: start, lt: end } },
      orderBy: { startedAt: 'desc' },
    });
  }
}
