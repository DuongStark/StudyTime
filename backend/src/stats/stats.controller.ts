import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  getStats(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.statsService.getStats(from, to);
  }
}
