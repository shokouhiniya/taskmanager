import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActionStatus } from '../database/entities/action.entity';

@Controller('actions')
@UseGuards(JwtAuthGuard)
export class ActionsController {
  constructor(private actionsService: ActionsService) {}

  @Post()
  create(@Body() body: { title: string; description: string; assignedToId: string; reportIds: string[] }) {
    return this.actionsService.create(body.title, body.description, body.assignedToId, body.reportIds);
  }

  @Get()
  findAll() {
    return this.actionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actionsService.findOne(id);
  }

  @Post(':id/logs')
  addLog(@Param('id') id: string, @Body() body: { description: string; result?: string; cost?: number }) {
    return this.actionsService.addLog(id, body.description, body.result, body.cost);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: ActionStatus }) {
    return this.actionsService.updateStatus(id, body.status);
  }
}
