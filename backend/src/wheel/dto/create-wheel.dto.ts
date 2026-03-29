import {
  IsString,
  Length,
  IsEnum,
  IsNumber,
  Min,
  Matches,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WheelSegmentDto } from './wheel-segment.dto';
import { WheelStatus } from '../entities/wheel.entity';

export class CreateWheelDto {
  @IsString()
  @Length(3, 80)
  name: string;

  @IsString()
  description: string;

  @IsEnum(WheelStatus)
  status: WheelStatus;

  @IsNumber()
  @Min(1)
  maxSpinsPerUser: number;

  @IsNumber()
  @Min(0)
  spinCost: number;

  @Matches(/^#([0-9A-Fa-f]{6})$/)
  backgroundColor: string;

  @Matches(/^#([0-9A-Fa-f]{6})$/)
  borderColor: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => WheelSegmentDto)
  segments: WheelSegmentDto[];
}