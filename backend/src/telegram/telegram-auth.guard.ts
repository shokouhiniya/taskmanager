import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class TelegramAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const initData = request.headers['x-telegram-init-data'];
    
    if (!initData) {
      return false;
    }

    return this.validateTelegramWebAppData(initData);
  }

  private validateTelegramWebAppData(initData: string): boolean {
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (!botToken) return false;

      const urlParams = new URLSearchParams(initData);
      const hash = urlParams.get('hash');
      urlParams.delete('hash');

      const dataCheckString = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

      const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest();

      const calculatedHash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

      return calculatedHash === hash;
    } catch (error) {
      console.error('Telegram auth validation error:', error);
      return false;
    }
  }
}
