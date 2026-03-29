import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WheelSegment } from './wheel-segment.entity';

export enum WheelStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class Wheel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 80 })
  name: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: WheelStatus })
  status: WheelStatus;

  @Column()
  maxSpinsPerUser: number;

  @Column('float')
  spinCost: number;

  @Column()
  backgroundColor: string;

  @Column()
  borderColor: string;

  @OneToMany(() => WheelSegment, (segment) => segment.wheel, {
    cascade: true,
    eager: true,
  })
  segments: WheelSegment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}