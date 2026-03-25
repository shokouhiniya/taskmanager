import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { Form } from './form.entity';
import { Category } from './category.entity';
import { Action } from './action.entity';

export enum ReportStatus {
  NEW = 'new',
  APPROVED = 'approved',
  ASSIGNED = 'assigned',
  REJECTED = 'rejected'
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.reports)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_to' })
  assignedTo: User;

  @Column({ name: 'assigned_to', nullable: true })
  assignedToId: string;

  @ManyToOne(() => Form)
  @JoinColumn({ name: 'form_id' })
  form: Form;

  @Column({ name: 'form_id' })
  formId: string;

  @Column({ type: 'text' })
  data: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column({ default: 'new' })
  status: string;

  @ManyToMany(() => Action, action => action.reports)
  actions: Action[];

  @CreateDateColumn()
  createdAt: Date;
}
