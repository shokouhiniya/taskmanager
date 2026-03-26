import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Report } from './report.entity';

export enum UserRole {
  REPORTER = 'reporter',
  OPERATOR = 'operator',
  ADMIN = 'admin'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ unique: true, nullable: true })
  telegramId: string;

  @Column({ unique: true, nullable: true })
  baleId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ default: 'reporter' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Report, report => report.user)
  reports: Report[];
}
