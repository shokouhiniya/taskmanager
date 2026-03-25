import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../database/entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(name: string, description?: string) {
    const category = this.categoryRepository.create({ name, description });
    return this.categoryRepository.save(category);
  }

  async findAll() {
    return this.categoryRepository.find({ order: { name: 'ASC' } });
  }

  async delete(id: string) {
    await this.categoryRepository.delete(id);
    return { message: 'دسته‌بندی حذف شد' };
  }
}
