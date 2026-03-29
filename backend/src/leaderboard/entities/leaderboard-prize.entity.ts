import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Leaderboard } from './leaderboard.entity';

export enum PrizeType {
  COINS = 'coins',
  FREESPIN = 'freeSpin',
  BONUS = 'bonus',
}

@Entity()
export class LeaderboardPrize {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rank: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: PrizeType })
  type: PrizeType;

  @Column()
  amount: number;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Leaderboard, (leaderboard) => leaderboard.prizes, {
    onDelete: 'CASCADE',
  })
  leaderboard: Leaderboard;
}