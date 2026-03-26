import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FormsModule } from './forms/forms.module';
import { ReportsModule } from './reports/reports.module';
import { ActionsModule } from './actions/actions.module';
import { CategoriesModule } from './categories/categories.module';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';
import { TelegramModule } from './telegram/telegram.module';
import { User } from './database/entities/user.entity';
import { Form } from './database/entities/form.entity';
import { Category } from './database/entities/category.entity';
import { Report } from './database/entities/report.entity';
import { Action } from './database/entities/action.entity';
import { ActionLog } from './database/entities/action-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: 'incident_system.db',
      autoSave: true,
      entities: [User, Form, Category, Report, Action, ActionLog],
      synchronize: true,
    }),
    AuthModule,
    FormsModule,
    ReportsModule,
    ActionsModule,
    CategoriesModule,
    SeedModule,
    UsersModule,
    TelegramModule,
  ],
})
export class AppModule {}
