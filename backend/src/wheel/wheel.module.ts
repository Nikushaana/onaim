import { Module } from '@nestjs/common';
import { WheelService } from './wheel.service';
import { WheelController } from './wheel.controller';
import { WheelSegment } from './entities/wheel-segment.entity';
import { Wheel } from './entities/wheel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wheel, WheelSegment]),
  ],
  providers: [WheelService],
  controllers: [WheelController]
})
export class WheelModule { }
