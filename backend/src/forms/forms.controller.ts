import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FormsService } from './forms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('forms')
@UseGuards(JwtAuthGuard)
export class FormsController {
  constructor(private formsService: FormsService) {}

  @Post()
  create(@Body() body: { title: string; schema: any }) {
    return this.formsService.create(body.title, body.schema);
  }

  @Get()
  findAll() {
    return this.formsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { title: string; schema: any }) {
    return this.formsService.update(id, body.title, body.schema);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.formsService.delete(id);
  }
}
