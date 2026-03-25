import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action, ActionStatus } from '../database/entities/action.entity';
import { ActionLog } from '../database/entities/action-log.entity';
import { Report } from '../database/entities/report.entity';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(Action)
    private actionRepository: Repository<Action>,
    @InjectRepository(ActionLog)
    private actionLogRepository: Repository<ActionLog>,
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  async create(title: string, description: string, assignedToId: string, reportIds: string[]) {
    const action = this.actionRepository.create({
      title,
      description,
      assignedToId,
    });

    const savedAction = await this.actionRepository.save(action);

    if (reportIds && reportIds.length > 0) {
      const reports = await this.reportRepository.findByIds(reportIds);
      savedAction.reports = reports;
      await this.actionRepository.save(savedAction);
    }

    return savedAction;
  }

  async findAll() {
    return this.actionRepository.find({
      relations: ['assignedTo', 'reports', 'logs'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.actionRepository.findOne({
      where: { id },
      relations: ['assignedTo', 'reports', 'logs'],
    });
  }

  async addLog(actionId: string, description: string, result?: string, cost?: number) {
    const log = this.actionLogRepository.create({
      actionId,
      description,
      result,
      cost,
    });
    return this.actionLogRepository.save(log);
  }

  async updateStatus(id: string, status: ActionStatus) {
    await this.actionRepository.update(id, { status });
    return this.findOne(id);
  }
}
