# 🚀 Telegram & Bale Mini App - Incident & Action Management System

A full-stack incident and action management system built as a Mini App for **Telegram** and **Bale** messengers with NestJS backend and React frontend.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Platforms](https://img.shields.io/badge/platforms-Telegram%20%7C%20Bale-blue.svg)

## ✨ Features

### 🔐 Authentication
- **Telegram** WebApp authentication with automatic login
- **Bale** WebApp authentication with automatic login
- Automatic platform detection
- JWT token-based authentication
- Username/password login for web access
- Role-based access control (Admin, Operator, Reporter)

### 👥 User Management
- Create, edit, and delete users
- Quick role change with dropdown
- Duplicate username/phone validation
- Password hashing with bcrypt

### 📋 Report Management
- Dynamic form builder for custom report types
- Create reports with custom fields
- Assign reports to users
- Approve/reject workflow
- Status tracking (new, approved, assigned, rejected)

### ⚡ Action Management
- Create actions linked to reports
- Assign actions to users
- Track action status (in progress, completed, failed)
- Action logs and history

### 📁 Category Management
- Create and manage report categories
- Organize reports by category

### 🎨 UI/UX
- Glassmorphism design with backdrop blur
- Mobile-optimized responsive layout
- Bottom navigation for Telegram Mini App
- Vazirmatn Persian font
- Dark gradient background
- Smooth animations and transitions

## 🛠️ Tech Stack

### Backend
- **Framework:** NestJS
- **Database:** SQLite with TypeORM
- **Authentication:** JWT + Passport
- **Messengers:** Telegram & Bale (node-telegram-bot-api)
- **Password:** bcrypt

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Telegram SDK:** @twa-dev/sdk
- **Styling:** Custom CSS with glassmorphism

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- **Telegram** Bot Token (from [@BotFather](https://t.me/BotFather))
- **Bale** Bot Token (from [@BotFather](https://ble.ir/BotFather))
- ngrok (for local development)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd taskmanager
```

### 2. Install dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Configure environment variables

Create `backend/.env`:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
BALE_BOT_TOKEN=your-bale-bot-token
BALE_API_URL=https://tapi.bale.ai
WEBAPP_URL=https://your-ngrok-url.ngrok-free.dev
PORT=3000
```

Or copy from example:
```bash
cp backend/.env.example backend/.env
# Then edit with your tokens
```

### 4. Start the application

#### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

#### Terminal 3 - ngrok
```bash
ngrok http 5173
```

### 5. Configure Bots

#### For Telegram:
1. Go to [@BotFather](https://t.me/BotFather)
2. Send `/mybots` → Select your bot
3. Bot Settings → Menu Button → Configure Menu Button
4. URL: `https://your-ngrok-url.ngrok-free.dev`
5. Text: `🚀 ورود به سامانه`

#### For Bale:
1. Go to [@BotFather](https://ble.ir/BotFather) in Bale
2. Send `/setminiapp`
3. URL: `https://your-ngrok-url.ngrok-free.dev`
4. Text: `🚀 ورود به سامانه`

## 🚀 Quick Start Scripts

### For Telegram
#### Windows
```bash
start-telegram-app.bat
```

#### Linux/Mac
```bash
chmod +x start-telegram-app.sh
./start-telegram-app.sh
```

### For Bale
#### Windows
```bash
start-bale-app.bat
```

#### Linux/Mac
```bash
chmod +x start-bale-app.sh
./start-bale-app.sh
```

## 📱 Usage

### For Telegram Mini App
1. Open your bot in Telegram
2. Send `/start`
3. Click on the Menu Button
4. Mini App opens automatically
5. You're logged in with your Telegram account

### For Bale Mini App
1. Open your bot in Bale
2. Send `/start`
3. Click on the Mini App button
4. Mini App opens automatically
5. You're logged in with your Bale account

### For Web Access
1. Open `http://localhost:5173`
2. Login with:
   - Username: `admin`
   - Password: `1236987450`

## 🏗️ Project Structure

```
taskmanager/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── actions/        # Action management
│   │   ├── auth/           # Authentication & JWT
│   │   ├── categories/     # Category management
│   │   ├── database/       # TypeORM entities
│   │   ├── forms/          # Form builder
│   │   ├── reports/        # Report management
│   │   ├── seed/           # Database seeding
│   │   ├── telegram/       # Telegram bot service
│   │   └── users/          # User management
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── api/           # Axios configuration
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── telegram/      # Telegram WebApp hooks
│   └── package.json
└── docs/                  # Documentation (Persian & English)
```

## 📚 Documentation

### English
- [Telegram Setup Guide](TELEGRAM_SETUP.md)
- [Bale Setup Guide](BALE_SETUP.md)

### Persian (فارسی)
- [راهنمای تلگرام](راهنمای_تلگرام.md)
- [راهنمای بله](راهنمای_بله.md)
- [شروع سریع](شروع_سریع_تلگرام.md)
- [راهنمای گام به گام](راهنمای_گام_به_گام_تلگرام.md)
- [مدیریت کاربران](راهنمای_مدیریت_کاربران.md)
- [رفع مشکلات](راهنمای_رفع_مشکل_لاگین.md)

## 🔧 Configuration

### Vite Proxy (for Telegram Mini App)
The frontend uses Vite proxy to forward API requests:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
}
```

### Axios Configuration
Automatically detects Telegram WebApp and uses appropriate base URL:
```typescript
const api = axios.create({
  baseURL: isTelegramWebApp ? '/api' : 'http://localhost:3000',
});
```

## 🎯 Features in Detail

### User Roles
- **Admin:** Full access to all features
- **Operator:** Manage reports and actions
- **Reporter:** Create reports and view assigned items

### Report Workflow
1. Reporter creates a report
2. Admin/Operator reviews and approves
3. Admin/Operator assigns to a user
4. Assigned user completes the action

### Form Builder
- Create custom forms with dynamic fields
- Supported field types: text, textarea, number, date
- Edit and delete forms
- Use forms for report creation

## 🐛 Troubleshooting

### "اطلاعات کاربر تلگرام یافت نشد"
- Make sure you're accessing via Telegram Menu Button
- Don't open the URL directly in browser

### "Network Error"
- Check if backend is running on port 3000
- Check if frontend is running on port 5173
- Restart ngrok and update URL in BotFather

### "UNIQUE constraint failed"
- This error is handled automatically now
- Clear localStorage if persists: `localStorage.clear()`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ by Shokouh

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- React team for the powerful library
- Telegram team for the Mini App platform
- Vazirmatn font by Saber Rastikerdar

---

**Note:** This is a Telegram Mini App. For the best experience, use it through Telegram.

For detailed setup instructions in Persian, see [راهنمای_تلگرام.md](راهنمای_تلگرام.md)
