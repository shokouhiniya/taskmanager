# 🚀 راهنمای Deploy روی taskmanager.mardomi.org

## 📋 پیش‌نیازها

- ✅ سرور با دسترسی SSH
- ✅ Docker و Docker Compose نصب شده
- ✅ Domain: `taskmanager.mardomi.org` به IP سرور متصل شده
- ✅ Nginx یا reverse proxy برای HTTPS

---

## 🐳 روش 1: Deploy با Docker Compose (پیشنهادی)

### مرحله 1: ایجاد docker-compose.production.yml

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: taskmanager_backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - TELEGRAM_API_URL=https://api.telegram.org
      - BALE_BOT_TOKEN=${BALE_BOT_TOKEN}
      - BALE_API_URL=https://tapi.bale.ai
    volumes:
      - ./data:/app
    restart: unless-stopped
    networks:
      - taskmanager_network

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: taskmanager_frontend
    ports:
      - "4173:4173"
    environment:
      - VITE_API_URL=https://taskmanager.mardomi.org/api
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - taskmanager_network

  nginx:
    image: nginx:alpine
    container_name: taskmanager_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
    networks:
      - taskmanager_network

networks:
  taskmanager_network:
    driver: bridge

volumes:
  taskmanager_data:
```

### مرحله 2: ایجاد فایل .env.production

```bash
# JWT Secret (حتماً تصادفی و قوی باشد)
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars

# Telegram Bot
TELEGRAM_BOT_TOKEN=8787350194:AAHzqvnJhvPOh1Fg6I7L8dEbav95N6e1u04

# Bale Bot
BALE_BOT_TOKEN=407715407:wf0tQMl7yRbnqsOhkUUyIMxb7p8simgjGmg
```

### مرحله 3: ایجاد Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:3000;
    }

    upstream frontend {
        server frontend:4173;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name taskmanager.mardomi.org;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name taskmanager.mardomi.org;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Backend API
        location /api/ {
            proxy_pass http://backend/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

### مرحله 4: دریافت SSL Certificate

```bash
# نصب Certbot
sudo apt update
sudo apt install certbot

# دریافت certificate
sudo certbot certonly --standalone -d taskmanager.mardomi.org

# کپی certificates
sudo mkdir -p ./ssl
sudo cp /etc/letsencrypt/live/taskmanager.mardomi.org/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/taskmanager.mardomi.org/privkey.pem ./ssl/
sudo chmod 644 ./ssl/*.pem
```

### مرحله 5: Build و اجرا

```bash
# Clone repository
git clone https://github.com/shokouhiniya/taskmanager.git
cd taskmanager

# ایجاد .env.production
nano .env.production
# محتویات را وارد کنید و ذخیره کنید

# Build و اجرا
docker-compose -f docker-compose.production.yml --env-file .env.production up -d

# مشاهده logs
docker-compose -f docker-compose.production.yml logs -f
```

---

## 🔧 روش 2: Deploy بدون Docker

### مرحله 1: نصب Dependencies

```bash
# Clone repository
git clone https://github.com/shokouhiniya/taskmanager.git
cd taskmanager

# Backend
cd backend
npm install --production
npm run build

# Frontend
cd ../frontend
npm install
npm run build
```

### مرحله 2: تنظیم Environment Variables

```bash
# Backend .env
cd backend
nano .env
```

```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
TELEGRAM_BOT_TOKEN=8787350194:AAHzqvnJhvPOh1Fg6I7L8dEbav95N6e1u04
TELEGRAM_API_URL=https://api.telegram.org
BALE_BOT_TOKEN=407715407:wf0tQMl7yRbnqsOhkUUyIMxb7p8simgjGmg
BALE_API_URL=https://tapi.bale.ai
```

### مرحله 3: اجرا با PM2

```bash
# نصب PM2
npm install -g pm2

# اجرای Backend
cd backend
pm2 start dist/main.js --name taskmanager-backend

# اجرای Frontend (با serve)
cd ../frontend
npm install -g serve
pm2 start "serve -s dist -l 4173" --name taskmanager-frontend

# ذخیره PM2 config
pm2 save
pm2 startup
```

### مرحله 4: تنظیم Nginx

```bash
sudo nano /etc/nginx/sites-available/taskmanager
```

```nginx
server {
    listen 80;
    server_name taskmanager.mardomi.org;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name taskmanager.mardomi.org;

    ssl_certificate /etc/letsencrypt/live/taskmanager.mardomi.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/taskmanager.mardomi.org/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:4173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# فعال‌سازی
sudo ln -s /etc/nginx/sites-available/taskmanager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔐 تنظیمات امنیتی

### 1. JWT Secret قوی

```bash
# تولید JWT Secret تصادفی
openssl rand -base64 32
```

### 2. Firewall

```bash
# فقط پورت‌های 80 و 443 باز باشند
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. محدود کردن دسترسی به Backend

در nginx.conf:
```nginx
# فقط از طریق /api قابل دسترسی باشد
location /api/ {
    # ...
}

# دسترسی مستقیم به backend را ببندید
location ~ ^/(auth|users|reports|actions|forms|categories)/ {
    return 404;
}
```

---

## 📱 تنظیم Mini Apps

### Telegram Bot

```bash
# تنظیم Menu Button
curl -X POST "https://api.telegram.org/bot8787350194:AAHzqvnJhvPOh1Fg6I7L8dEbav95N6e1u04/setChatMenuButton" \
  -H "Content-Type: application/json" \
  -d '{
    "menu_button": {
      "type": "web_app",
      "text": "🚀 ورود به سامانه",
      "web_app": {
        "url": "https://taskmanager.mardomi.org"
      }
    }
  }'
```

### Bale Bot

1. به [@BotFather](https://ble.ir/BotFather) در بله بروید
2. دستور `/setminiapp` را بفرستید
3. URL: `https://taskmanager.mardomi.org`

---

## 🔄 بروزرسانی

### با Docker

```bash
cd taskmanager
git pull
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d
```

### با PM2

```bash
cd taskmanager
git pull

# Backend
cd backend
npm install
npm run build
pm2 restart taskmanager-backend

# Frontend
cd ../frontend
npm install
npm run build
pm2 restart taskmanager-frontend
```

---

## 🐛 عیب‌یابی

### چک کردن وضعیت سرویس‌ها

```bash
# Docker
docker-compose -f docker-compose.production.yml ps
docker-compose -f docker-compose.production.yml logs -f

# PM2
pm2 status
pm2 logs taskmanager-backend
pm2 logs taskmanager-frontend

# Nginx
sudo nginx -t
sudo systemctl status nginx
```

### مشکلات رایج

#### 1. 502 Bad Gateway
**علت:** Backend در دسترس نیست
```bash
# چک کردن Backend
curl http://localhost:3000
pm2 restart taskmanager-backend
```

#### 2. SSL Certificate Error
**علت:** Certificate منقضی شده
```bash
sudo certbot renew
sudo systemctl reload nginx
```

#### 3. CORS Error
**علت:** تنظیمات CORS در Backend
```bash
# در backend/src/main.ts
app.enableCors({
  origin: 'https://taskmanager.mardomi.org',
  credentials: true,
});
```

---

## ✅ چک لیست Deploy

- [ ] Domain به IP سرور متصل شده
- [ ] SSL Certificate دریافت شده
- [ ] Docker/PM2 نصب شده
- [ ] .env.production ایجاد شده
- [ ] JWT_SECRET تصادفی و قوی است
- [ ] Nginx تنظیم شده
- [ ] Backend روی پورت 3000 در حال اجرا است
- [ ] Frontend روی پورت 4173 در حال اجرا است
- [ ] https://taskmanager.mardomi.org باز می‌شود
- [ ] Login کار می‌کند
- [ ] Telegram Mini App تنظیم شده
- [ ] Bale Mini App تنظیم شده
- [ ] Firewall تنظیم شده

---

## 🎯 دسترسی نهایی

بعد از deploy موفق:

**Browser:**
```
https://taskmanager.mardomi.org
Username: admin
Password: 1236987450
```

**Telegram Mini App:**
- ربات را در تلگرام باز کنید
- روی Menu Button کلیک کنید

**Bale Mini App:**
- ربات را در بله باز کنید
- روی Menu Button کلیک کنید

---

موفق باشید! 🚀
