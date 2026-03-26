import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Report } from './report.entity';

export enum UserRole {
  REPORTER = 'reporter',
  OPERATOR = 'operator',
  ADMIN = 'admin'
}

export enum UserStatus {
  PENDING = 'pending',      // در انتظار تایید
  APPROVED = 'approved',    // تایید شده
  REJECTED = 'rejected'     // رد شده
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

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true, unique: true })
  nationalId: string;

  @Column({ default: 'reporter' })
  role: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: false })
  isRegistered: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Report, report => report.user)
  reports: Report[];
}
