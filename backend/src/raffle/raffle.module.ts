import { Module } from '@nestjs/common';
import { RaffleController } from './raffle.controller';
import { RaffleService } from './raffle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Raffle } from './entities/raffle.entity';
import { RafflePrize } from './entities/raffle-prize.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Raffle, RafflePrize])],
  controllers: [RaffleController],
  providers: [RaffleService]
})
export class RaffleModule { }
