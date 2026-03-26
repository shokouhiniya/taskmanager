import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  private readonly webAppUrl = process.env.WEBAPP_URL || 'http://localhost:5173';
  private readonly baleApiUrl = process.env.BALE_API_URL || 'https://tapi.bale.ai';
  private readonly baleToken = process.env.BALE_BOT_TOKEN;
  private readonly channelUsername = process.env.BALE_CHANNEL_USERNAME || '@tasksmanager'; // نام کانال بله

  onModuleInit() {
    const token = this.baleToken;
    
    if (!token) {
      console.warn('⚠️ BALE_BOT_TOKEN not found in .env');
      return;
    }

    try {
      this.bot = new TelegramBot(token, { 
        polling: false,
        baseApiUrl: this.baleApiUrl
      });
      console.log('✅ Bale Bot initialized (polling disabled)');
      console.log('🔗 Bale API URL:', this.baleApiUrl);
      console.log('📢 Channel:', this.channelUsername);
    } catch (error) {
      console.error('❌ Bale Bot initialization failed:', error.message);
    }
  }

  async checkChannelMembership(userId: string): Promise<boolean> {
    if (!this.bot || !this.baleToken) {
      console.warn('⚠️ Cannot check channel membership: Bot not initialized');
      return false; // اگر بات نیست، دسترسی نده
    }

    try {
      console.log(`🔍 Checking membership for user ${userId} in channel ${this.channelUsername}`);
      
      const member = await this.bot.getChatMember(this.channelUsername, parseInt(userId));
      
      console.log('📋 Channel membership check response:', member);

      // وضعیت‌های مجاز: creator, administrator, member
      const isAllowed = ['creator', 'administrator', 'member'].includes(member.status);
      console.log(`✅ User ${userId} membership status: ${member.status} - Allowed: ${isAllowed}`);
      
      return isAllowed;
    } catch (error: any) {
      console.error('❌ Error checking channel membership:', error.message);
      console.error('📋 Error details:', error);
      // در صورت خطا، اجازه دسترسی نده
      return false;
    }
  }

  async sendNotification(baleId: string, message: string) {
    try {
      if (!this.bot) return false;
      await this.bot.sendMessage(baleId, message);
      return true;
    } catch (error) {
      console.error('Error sending bale notification:', error);
      return false;
    }
  }

  // متد موقت برای تست
  async testChannelMembership(userId: string) {
    return this.checkChannelMembership(userId);
  }
}
