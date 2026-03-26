import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../database/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    
    if (!user) {
      throw new Error('کاربر یافت نشد');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('رمز عبور اشتباه است');
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new Error('کاربر یافت نشد');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('رمز عبور فعلی اشتباه است');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });
    
    return { message: 'رمز عبور با موفقیت تغییر کرد' };
  }

  async loginWithTelegram(telegramId: string, firstName: string, lastName?: string, username?: string) {
    let user = await this.userRepository.findOne({ where: { telegramId } });
    
    if (!user) {
      // ایجاد کاربر جدید با Telegram ID
      const name = `${firstName}${lastName ? ' ' + lastName : ''}`;
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      user = this.userRepository.create({
        telegramId,
        username: username || `tg_${telegramId}`,
        password: hashedPassword,
        phone: telegramId,
        name,
        role: 'reporter',
      });
      
      try {
        user = await this.userRepository.save(user);
      } catch (error) {
        // اگر کاربر با این telegramId وجود داره ولی password نداره
        user = await this.userRepository.findOne({ where: { telegramId } });
        if (user && !user.password) {
          // آپدیت کردن password
          user.password = hashedPassword;
          user.name = name;
          if (username) user.username = username;
          user = await this.userRepository.save(user);
        } else {
          throw error;
        }
      }
    } else if (!user.password) {
      // اگر کاربر وجود داره ولی password نداره، یکی بهش بدیم
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user.password = hashedPassword;
      user = await this.userRepository.save(user);
    }

    const payload = { sub: user.id, telegramId: user.telegramId, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        name: user.name,
        role: user.role,
        telegramId: user.telegramId,
      },
    };
  }

  async loginWithBale(baleId: string, firstName: string, lastName?: string, username?: string) {
    let user = await this.userRepository.findOne({ where: { baleId } });
    
    if (!user) {
      // ایجاد کاربر جدید با Bale ID - وضعیت pending و ثبت نام نشده
      const name = `${firstName}${lastName ? ' ' + lastName : ''}`;
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      user = this.userRepository.create({
        baleId,
        username: username || `bale_${baleId}`,
        password: hashedPassword,
        phone: baleId,
        name,
        role: 'reporter',
        status: 'pending',
        isRegistered: false,
      });
      
      try {
        user = await this.userRepository.save(user);
      } catch (error) {
        user = await this.userRepository.findOne({ where: { baleId } });
        if (user && !user.password) {
          user.password = hashedPassword;
          user.name = name;
          if (username) user.username = username;
          user = await this.userRepository.save(user);
        } else {
          throw error;
        }
      }
    } else if (!user.password) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user.password = hashedPassword;
      user = await this.userRepository.save(user);
    }

    const payload = { sub: user.id, baleId: user.baleId, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        name: user.name,
        lastName: user.lastName,
        nationalId: user.nationalId,
        role: user.role,
        status: user.status,
        isRegistered: user.isRegistered,
        baleId: user.baleId,
      },
    };
  }

  async completeRegistration(userId: string, data: { name: string; lastName: string; nationalId: string; phone: string }) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new Error('کاربر یافت نشد');
    }

    // بررسی تکراری نبودن کد ملی
    if (data.nationalId) {
      const existingUser = await this.userRepository.findOne({ 
        where: { nationalId: data.nationalId } 
      });
      if (existingUser && existingUser.id !== userId) {
        throw new Error('این کد ملی قبلاً ثبت شده است');
      }
    }

    // بروزرسانی اطلاعات کاربر
    user.name = data.name;
    user.lastName = data.lastName;
    user.nationalId = data.nationalId;
    user.phone = data.phone;
    user.isRegistered = true;
    user.status = 'pending'; // در انتظار تایید ادمین

    await this.userRepository.save(user);

    return {
      message: 'اطلاعات شما با موفقیت ثبت شد و در انتظار تایید مدیر است',
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        nationalId: user.nationalId,
        phone: user.phone,
        role: user.role,
        status: user.status,
        isRegistered: user.isRegistered,
      },
    };
  }
}
