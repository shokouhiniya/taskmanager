import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Report } from '../database/entities/report.entity';
import { Form } from '../database/entities/form.entity';
import { Category } from '../database/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Form, Category])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
