import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RafflePrize } from './raffle-prize.entity';

export enum RaffleStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  DRAWN = 'drawn',
  CANCELLED = 'cancelled',
}

@Entity()
export class Raffle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 80 })
  name: string;

  @Column()
  description: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  drawDate: string;

  @Column({ type: 'enum', enum: RaffleStatus })
  status: RaffleStatus;

  @Column('float')
  ticketPrice: number;

  @Column()
  maxTicketsPerUser: number;

  @Column({ nullable: true })
  totalTicketLimit: number;

  @OneToMany(() => RafflePrize, (p) => p.raffle, {
    cascade: true,
    eager: true,
  })
  prizes: RafflePrize[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}