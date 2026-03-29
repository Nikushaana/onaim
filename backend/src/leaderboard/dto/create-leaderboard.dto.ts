import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsDateString,
  Length,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PrizeType } from '../entities/leaderboard-prize.entity';
import { LeaderboardStatus, ScoringType } from '../entities/leaderboard.entity';

class PrizeDto {
  @IsNumber()
  rank: number;

  @IsString()
  name: string;

  @IsEnum(PrizeType)
  type: PrizeType;

  @IsNumber()
  amount: number;

  @IsString()
  imageUrl: string;
}

export class CreateLeaderboardDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(LeaderboardStatus)
  status: LeaderboardStatus;

  @IsEnum(ScoringType)
  scoringType: ScoringType;

  @IsInt()
  @Min(2)
  maxParticipants: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PrizeDto)
  prizes: PrizeDto[];
}