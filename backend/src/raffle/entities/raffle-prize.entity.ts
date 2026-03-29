import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Raffle } from './raffle.entity';

export enum PrizeType {
  COINS = 'coins',
  FREESPIN = 'freeSpin',
  BONUS = 'bonus',
}

@Entity()
export class RafflePrize {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: PrizeType })
  type: PrizeType;

  @Column()
  amount: number;

  @Column()
  quantity: number;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Raffle, (raffle) => raffle.prizes, {
    onDelete: 'CASCADE',
  })
  raffle: Raffle;
}