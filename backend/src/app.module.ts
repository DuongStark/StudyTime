import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SessionsModule } from './sessions/sessions.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [PrismaModule, SessionsModule, StatsModule],
})
export class AppModule {}
