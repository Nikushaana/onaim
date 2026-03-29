import {
  IsString,
  Length,
  IsDateString,
  IsEnum,
  IsNumber,
  Min,
  IsInt,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RaffleStatus } from '../entities/raffle.entity';
import { PrizeType } from '../entities/raffle-prize.entity';

class PrizeDto {
  @IsString()
  name: string;

  @IsEnum(PrizeType)
  type: PrizeType;

  @IsNumber()
  amount: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  imageUrl: string;
}

export class CreateRaffleDto {
  @IsString()
  @Length(3, 80)
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsDateString()
  drawDate: string;

  @IsEnum(RaffleStatus)
  status: RaffleStatus;

  @IsNumber()
  @Min(0.01)
  ticketPrice: number;

  @IsInt()
  @Min(1)
  maxTicketsPerUser: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  totalTicketLimit: number | null;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PrizeDto)
  prizes: PrizeDto[];
}