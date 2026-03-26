import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepository.find({
      select: ['id', 'username', 'phone', 'name', 'role', 'createdAt', 'baleId', 'telegramId'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(username: string, password: string, phone: string, name: string, role: string) {
    // چک کردن تکراری بودن username
    const existingUsername = await this.userRepository.findOne({ where: { username } });
    if (existingUsername) {
      throw new Error('این نام کاربری قبلاً استفاده شده است');
    }

    // چک کردن تکراری بودن phone
    const existingPhone = await this.userRepository.findOne({ where: { phone } });
    if (existingPhone) {
      throw new Error('این شماره موبایل قبلاً ثبت شده است');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      phone,
      name,
      role,
    });
    
    await this.userRepository.save(user);
    
    return {
      id: user.id,
      username: user.username,
      phone: user.phone,
      name: user.name,
      role: user.role,
    };
  }

  async update(id: string, phone: string, name: string, role: string, password?: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('کاربر یافت نشد');
    }

    // چک کردن تکراری بودن phone (اگر تغییر کرده)
    if (phone !== user.phone) {
      const existingPhone = await this.userRepository.findOne({ where: { phone } });
      if (existingPhone) {
        throw new Error('این شماره موبایل قبلاً ثبت شده است');
      }
    }

    const updateData: any = { phone, name, role };
    
    // اگر password جدید داده شده، hash کن و آپدیت کن
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await this.userRepository.update(id, updateData);
    
    return this.userRepository.findOne({ 
      where: { id },
      select: ['id', 'username', 'phone', 'name', 'role']
    });
  }

  async updateRole(id: string, role: string) {
    await this.userRepository.update(id, { role });
    return this.userRepository.findOne({ 
      where: { id },
      select: ['id', 'username', 'phone', 'name', 'role']
    });
  }

  async delete(id: string) {
    await this.userRepository.delete(id);
    return { message: 'کاربر حذف شد' };
  }

  async deleteAllExceptAdmin() {
    // حذف تمام کاربران به جز ادمین
    const result = await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('username != :username', { username: 'admin' })
      .execute();
    
    return { 
      message: 'تمام کاربران به جز ادمین حذف شدند',
      deletedCount: result.affected 
    };
  }
}
