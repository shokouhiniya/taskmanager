import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  create(@Body() body: { name: string; description?: string }) {
    return this.categoriesService.create(body.name, body.description);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}
