import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  private readonly webAppUrl = process.env.WEBAPP_URL || 'http://localhost:5173';

  onModuleInit() {
    const token = process.env.BALE_BOT_TOKEN;
    const apiUrl = process.env.BALE_API_URL || 'https://tapi.bale.ai';
    
    if (!token) {
      console.warn('⚠️ BALE_BOT_TOKEN not found in .env');
      return;
    }

    try {
      this.bot = new TelegramBot(token, { 
        polling: false,
        baseApiUrl: apiUrl
      });
      console.log('✅ Bale Bot initialized (polling disabled)');
      console.log('🔗 Bale API URL:', apiUrl);
    } catch (error) {
      console.error('❌ Bale Bot initialization failed:', error.message);
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
}
