import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../database/entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  async create(userId: string, formId: string, data: any, categoryId: string) {
    const report = this.reportRepository.create({
      userId,
      formId,
      data: JSON.stringify(data),
      categoryId,
      status: 'new',
    });
    const saved = await this.reportRepository.save(report);
    try {
      return { ...saved, data: JSON.parse(saved.data || '{}') };
    } catch {
      return { ...saved, data: {} };
    }
  }

  async findByUser(userId: string) {
    const reports = await this.reportRepository.find({
      where: { userId },
      relations: ['form', 'category', 'assignedTo'],
      order: { createdAt: 'DESC' },
    });
    return reports.map(r => {
      try {
        return { ...r, data: JSON.parse(r.data || '{}') };
      } catch {
        return { ...r, data: {} };
      }
    });
  }

  async findAssignedTo(userId: string) {
    const reports = await this.reportRepository.find({
      where: { assignedToId: userId, status: 'assigned' },
      relations: ['form', 'category', 'user'],
      order: { createdAt: 'DESC' },
    });
    return reports.map(r => {
      try {
        return { ...r, data: JSON.parse(r.data || '{}') };
      } catch {
        return { ...r, data: {} };
      }
    });
  }

  async findByCategory(categoryId: string) {
    const reports = await this.reportRepository.find({
      where: { categoryId },
      relations: ['user', 'form', 'assignedTo'],
      order: { createdAt: 'DESC' },
    });
    return reports.map(r => ({ ...r, data: JSON.parse(r.data) }));
  }

  async updateStatus(id: string, status: string) {
    await this.reportRepository.update(id, { status });
    const report = await this.reportRepository.findOne({ 
      where: { id },
      relations: ['form', 'category', 'assignedTo', 'user']
    });
    try {
      return { ...report, data: JSON.parse(report.data || '{}') };
    } catch {
      return { ...report, data: {} };
    }
  }

  async assignReport(id: string, assignedToId: string) {
    await this.reportRepository.update(id, { assignedToId, status: 'assigned' });
    const report = await this.reportRepository.findOne({ 
      where: { id },
      relations: ['form', 'category', 'assignedTo', 'user']
    });
    try {
      return { ...report, data: JSON.parse(report.data || '{}') };
    } catch {
      return { ...report, data: {} };
    }
  }

  async findAll() {
    const reports = await this.reportRepository.find({
      relations: ['user', 'form', 'category', 'assignedTo'],
      order: { createdAt: 'DESC' },
    });
    return reports.map(r => {
      try {
        return { ...r, data: JSON.parse(r.data || '{}') };
      } catch {
        return { ...r, data: {} };
      }
    });
  }
}
