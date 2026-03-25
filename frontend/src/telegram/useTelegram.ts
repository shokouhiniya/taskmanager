import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

export function useTelegram() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    setIsReady(true);
  }, []);

  return {
    WebApp,
    user: WebApp.initDataUnsafe?.user,
    isReady,
    isTelegramWebApp: WebApp.platform !== 'unknown',
  };
}
