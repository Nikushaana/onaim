import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Wheel } from './wheel.entity';

export enum PrizeType {
  COINS = 'coins',
  FREESPIN = 'freeSpin',
  BONUS = 'bonus',
  NOTHING = 'nothing',
}

@Entity()
export class WheelSegment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  @Column()
  color: string;

  @Column()
  weight: number;

  @Column({ type: 'enum', enum: PrizeType })
  prizeType: PrizeType;

  @Column()
  prizeAmount: number;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Wheel, (wheel) => wheel.segments, {
    onDelete: 'CASCADE',
  })
  wheel: Wheel;
}