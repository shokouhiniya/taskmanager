import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  create(@Request() req, @Body() body: { formId: string; data: any; categoryId: string }) {
    return this.reportsService.create(req.user.userId, body.formId, body.data, body.categoryId);
  }

  @Get('my')
  findMy(@Request() req) {
    return this.reportsService.findByUser(req.user.userId);
  }

  @Get('assigned')
  findAssigned(@Request() req) {
    return this.reportsService.findAssignedTo(req.user.userId);
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.reportsService.findByCategory(categoryId);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.reportsService.updateStatus(id, body.status);
  }

  @Put(':id/assign')
  assignReport(@Param('id') id: string, @Body() body: { assignedToId: string }) {
    return this.reportsService.assignReport(id, body.assignedToId);
  }
}
