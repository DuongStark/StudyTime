import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsService } from './sessions.service';
import { Session } from '@prisma/client';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(@Body() dto: CreateSessionDto): Promise<Session> {
    return this.sessionsService.create(dto);
  }

  @Get()
  findAll(@Query('date') date?: string): Promise<Session[]> {
    return this.sessionsService.findAll(date);
  }
}
