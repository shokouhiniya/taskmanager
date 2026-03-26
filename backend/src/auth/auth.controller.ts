import { Controller, Post, Put, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Request() req, @Body() body: { oldPassword: string; newPassword: string }) {
    return this.authService.changePassword(req.user.userId, body.oldPassword, body.newPassword);
  }

  @Post('telegram')
  async loginWithTelegram(@Body() body: { 
    telegramId: string; 
    firstName: string; 
    lastName?: string; 
    username?: string;
  }) {
    try {
      return await this.authService.loginWithTelegram(
        body.telegramId, 
        body.firstName, 
        body.lastName, 
        body.username
      );
    } catch (error) {
      console.error('❌ Telegram login error:', error.message);
      throw error;
    }
  }

  @Post('bale')
  async loginWithBale(@Body() body: { 
    baleId: string; 
    firstName: string; 
    lastName?: string; 
    username?: string;
  }) {
    try {
      return await this.authService.loginWithBale(
        body.baleId, 
        body.firstName, 
        body.lastName, 
        body.username
      );
    } catch (error) {
      console.error('❌ Bale login error:', error.message);
      throw error;
    }
  }

  @Post('complete-registration')
  @UseGuards(JwtAuthGuard)
  async completeRegistration(
    @Request() req,
    @Body() body: { 
      name: string; 
      lastName: string; 
      nationalId: string; 
      phone: string;
    }
  ) {
    try {
      return await this.authService.completeRegistration(req.user.userId, body);
    } catch (error) {
      console.error('❌ Registration error:', error.message);
      throw error;
    }
  }
}
