import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  private readonly webAppUrl = process.env.WEBAPP_URL || 'http://localhost:5173';

  onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.warn('⚠️ TELEGRAM_BOT_TOKEN not found in .env');
      return;
    }

    try {
      this.bot = new TelegramBot(token, { polling: false }); // غیرفعال کردن polling
      console.log('✅ Telegram Bot initialized (polling disabled)');
    } catch (error) {
      console.error('❌ Telegram Bot initialization failed:', error.message);
    }
  }

  async sendNotification(telegramId: string, message: string) {
    try {
      if (!this.bot) return false;
      await this.bot.sendMessage(telegramId, message);
      return true;
    } catch (error) {
      console.error('Error sending telegram notification:', error);
      return false;
    }
  }
}
