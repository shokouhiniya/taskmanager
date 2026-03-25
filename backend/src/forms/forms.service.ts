import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from '../database/entities/form.entity';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private formRepository: Repository<Form>,
  ) {}

  async create(title: string, schema: any) {
    const form = this.formRepository.create({ title, schema: JSON.stringify(schema) });
    const saved = await this.formRepository.save(form);
    return { ...saved, schema: JSON.parse(saved.schema) };
  }

  async findAll() {
    const forms = await this.formRepository.find({ where: { isActive: true } });
    return forms.map(f => ({ ...f, schema: JSON.parse(f.schema) }));
  }

  async findOne(id: string) {
    const form = await this.formRepository.findOne({ where: { id } });
    if (form) {
      return { ...form, schema: JSON.parse(form.schema) };
    }
    return null;
  }

  async update(id: string, title: string, schema: any) {
    await this.formRepository.update(id, { title, schema: JSON.stringify(schema) });
    return this.findOne(id);
  }

  async delete(id: string) {
    const form = await this.formRepository.findOne({ where: { id } });
    if (form) {
      await this.formRepository.remove(form);
    }
    return { message: 'فرم حذف شد' };
  }
}
