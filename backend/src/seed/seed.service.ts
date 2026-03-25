import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../database/entities/category.entity';
import { User } from '../database/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seed() {
    const categoryCount = await this.categoryRepository.count();
    
    if (categoryCount === 0) {
      await this.categoryRepository.save([
        { name: 'فنی', description: 'مشکلات فنی و تکنیکال' },
        { name: 'اداری', description: 'امور اداری و مالی' },
        { name: 'ایمنی', description: 'مسائل ایمنی و HSE' },
        { name: 'عملیاتی', description: 'مشکلات عملیاتی' },
      ]);
    }

    const adminUsername = 'admin';
    let admin = await this.userRepository.findOne({ where: { username: adminUsername } });
    
    if (!admin) {
      const hashedPassword = await bcrypt.hash('1236987450', 10);
      admin = this.userRepository.create({
        username: adminUsername,
        password: hashedPassword,
        phone: '09123456789',
        name: 'مدیر سیستم',
        role: 'admin',
      });
      await this.userRepository.save(admin);
    }

    return { message: 'Seed completed', admin: { username: admin.username, phone: admin.phone } };
  }
}
