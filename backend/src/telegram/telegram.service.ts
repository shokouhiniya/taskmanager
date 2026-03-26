import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

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
    if (!this.baleToken) {
      console.warn('⚠️ Cannot check channel membership: BALE_BOT_TOKEN not configured');
      return true; // اگر توکن نیست، اجازه دسترسی بده
    }

    try {
      const url = `${this.baleApiUrl}/bot${this.baleToken}/getChatMember`;
      const response = await axios.get(url, {
        params: {
          chat_id: this.channelUsername,
          user_id: userId
        }
      });

      console.log('📋 Channel membership check response:', response.data);

      if (response.data.ok) {
        const status = response.data.result.status;
        // وضعیت‌های مجاز: creator, administrator, member
        const isAllowed = ['creator', 'administrator', 'member'].includes(status);
        console.log(`✅ User ${userId} membership status: ${status} - Allowed: ${isAllowed}`);
        return isAllowed;
      }

      console.log(`❌ User ${userId} is not a member of channel`);
      return false;
    } catch (error: any) {
      console.error('❌ Error checking channel membership:', error.response?.data || error.message);
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
