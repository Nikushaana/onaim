import {
  IsString,
  IsNumber,
  Matches,
  IsEnum,
} from 'class-validator';
import { PrizeType } from '../entities/wheel-segment.entity';

export class WheelSegmentDto {
  @IsString()
  label: string;

  @Matches(/^#([0-9A-Fa-f]{6})$/)
  color: string;

  @IsNumber()
  weight: number;

  @IsEnum(PrizeType)
  prizeType: PrizeType;

  @IsNumber()
  prizeAmount: number;

  @IsString()
  imageUrl: string;
}