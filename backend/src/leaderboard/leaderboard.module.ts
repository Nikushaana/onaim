import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leaderboard } from './entities/leaderboard.entity';
import { LeaderboardPrize } from './entities/leaderboard-prize.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Leaderboard, LeaderboardPrize])],
  controllers: [LeaderboardController],
  providers: [LeaderboardService]
})
export class LeaderboardModule { }
