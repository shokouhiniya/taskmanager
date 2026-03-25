import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Report } from './report.entity';
import { ActionLog } from './action-log.entity';

export enum ActionStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

@Entity('actions')
export class Action {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_to' })
  assignedTo: User;

  @Column({ name: 'assigned_to' })
  assignedToId: string;

  @Column({ default: 'in_progress' })
  status: string;

  @ManyToMany(() => Report, report => report.actions)
  @JoinTable({
    name: 'action_reports',
    joinColumn: { name: 'action_id' },
    inverseJoinColumn: { name: 'report_id' }
  })
  reports: Report[];

  @OneToMany(() => ActionLog, log => log.action)
  logs: ActionLog[];

  @CreateDateColumn()
  createdAt: Date;
}
