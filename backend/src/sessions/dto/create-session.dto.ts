import { IsDateString, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsDateString()
  startedAt: string;

  @IsDateString()
  endedAt: string;

  @IsInt()
  @Min(1)
  @Max(120)
  durationMinutes: number;
}
