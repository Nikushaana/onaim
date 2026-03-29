import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LeaderboardPrize } from './leaderboard-prize.entity';

export enum LeaderboardStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export enum ScoringType {
  POINTS = 'points',
  WINS = 'wins',
  WAGERED = 'wagered',
}

@Entity()
export class Leaderboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column({ type: 'enum', enum: LeaderboardStatus })
  status: LeaderboardStatus;

  @Column({ type: 'enum', enum: ScoringType })
  scoringType: ScoringType;

  @Column()
  maxParticipants: number;

  @OneToMany(() => LeaderboardPrize, (prize) => prize.leaderboard, {
    cascade: true,
    eager: true,
  })
  prizes: LeaderboardPrize[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}