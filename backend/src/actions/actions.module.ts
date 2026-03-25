import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { Action } from '../database/entities/action.entity';
import { ActionLog } from '../database/entities/action-log.entity';
import { Report } from '../database/entities/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Action, ActionLog, Report])],
  controllers: [ActionsController],
  providers: [ActionsService],
})
export class ActionsModule {}
