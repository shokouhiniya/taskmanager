import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Action } from './action.entity';

@Entity('action_logs')
export class ActionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Action, action => action.logs)
  @JoinColumn({ name: 'action_id' })
  action: Action;

  @Column({ name: 'action_id' })
  actionId: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  result: string;

  @Column({ type: 'decimal', nullable: true })
  cost: number;

  @CreateDateColumn()
  createdAt: Date;
}
