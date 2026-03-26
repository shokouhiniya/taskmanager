import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReportList from './pages/ReportList';
import CreateReport from './pages/CreateReport';
import ActionList from './pages/ActionList';
import FormBuilder from './pages/FormBuilder';
import CreateAction from './pages/CreateAction';
import UserManagement from './pages/UserManagement';
import ChangePassword from './pages/ChangePassword';
import AssignedReports from './pages/AssignedReports';
import MyActions from './pages/MyActions';
import CategoryManagement from './pages/CategoryManagement';
import Navbar from './components/Navbar';
import TelegramNav from './components/TelegramNav';
import ProtectedRoute from './components/ProtectedRoute';
import api from './api/axios';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('app_token'));
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // بررسی اینکه آیا در Telegram WebApp هستیم
    const isTg = WebApp.platform !== 'unknown';
    setIsTelegramWebApp(isTg);

    if (isTg) {
      WebApp.ready();
      WebApp.expand();
      
      // اضافه کردن کلاس به body
      document.body.classList.add('telegram-webapp');
      
      // تنظیم رنگ‌های Telegram
      WebApp.setHeaderColor('#7c3aed');
      WebApp.setBackgroundColor('#7c3aed');

      const tgUser = WebApp.initDataUnsafe?.user;
      
      console.log('🔍 Telegram/Bale WebApp detected');
      console.log('📱 Platform:', WebApp.platform);
      console.log('👤 User:', tgUser);
      console.log('🔐 Init Data:', WebApp.initData);
      
      if (tgUser) {
        // تشخیص Telegram یا Bale
        const isBale = window.location.hostname.includes('bale') || WebApp.platform === 'bale';
        const endpoint = isBale ? '/auth/bale' : '/auth/telegram';
        const idField = isBale ? 'baleId' : 'telegramId';
        
        console.log(`🚀 Attempting ${isBale ? 'Bale' : 'Telegram'} login...`);
        
        // احراز هویت خودکار
        try {
          const response = await api.post(endpoint, {
            [idField]: tgUser.id.toString(),
            firstName: tgUser.first_name,
            lastName: tgUser.last_name,
            username: tgUser.username,
          });
          
          console.log('✅ Login successful:', response.data);
          console.log('📋 User data:', response.data.user);
          handleLogin(response.data.access_token, response.data.user);
        } catch (error: any) {
          console.error(`❌ ${isBale ? 'Bale' : 'Telegram'} auth error:`, error);
          console.error('📋 Error details:', error.response?.data);
          
          // بررسی اینکه آیا خطا به دلیل عدم عضویت در کانال است
          if (error.response?.data?.message?.includes('دسترسی ندارید') || 
              error.response?.data?.message?.includes('عضو کانال')) {
            setAccessDenied(true);
          } else {
            WebApp.showAlert(`خطا در احراز هویت: ${error.response?.data?.message || error.message}`);
          }
        }
      } else {
        console.error('❌ No user data found');
        console.error('📋 initDataUnsafe:', WebApp.initDataUnsafe);
        WebApp.showAlert('اطلاعات کاربر یافت نشد. لطفاً از طریق ربات وارد شوید.');
      }
    } else {
      // حالت عادی (بدون Telegram)
      const savedUser = localStorage.getItem('app_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    
    setLoading(false);
  };

  const handleLogin = (token: string, user: any) => {
    localStorage.setItem('app_token', token);
    localStorage.setItem('app_user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('app_token');
    localStorage.removeItem('app_user');
    setToken(null);
    setUser(null);
    
    if (isTelegramWebApp) {
      WebApp.close();
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>⏳</div>
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // نمایش پیام عدم دسترسی برای کاربران غیر عضو کانال
  if (accessDenied && isTelegramWebApp) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem'
      }}>
        <div className="card" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '64px', marginBottom: '1rem' }}>🚫</div>
          <h2 style={{ marginBottom: '1rem' }}>شما دسترسی ندارید</h2>
          <p style={{ color: '#757575', marginBottom: '1rem' }}>
            برای استفاده از این برنامه باید عضو کانال رابطین باشید
          </p>
          <button onClick={() => WebApp.close()} className="secondary">
            بستن
          </button>
        </div>
      </div>
    );
  }

  if (!token && !isTelegramWebApp) {
    return <Login onLogin={handleLogin} />;
  }

  if (!token && isTelegramWebApp) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem'
      }}>
        <div className="card" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '64px', marginBottom: '1rem' }}>❌</div>
          <h2 style={{ marginBottom: '1rem' }}>خطا در احراز هویت</h2>
          <p style={{ color: '#757575', marginBottom: '1rem' }}>
            لطفاً از طریق ربات تلگرام وارد شوید
          </p>
          <button onClick={() => WebApp.close()} className="secondary">
            بستن
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', paddingBottom: isTelegramWebApp ? '70px' : '0' }}>
        {!isTelegramWebApp && <Navbar user={user} onLogout={handleLogout} />}
        <div style={{ paddingTop: isTelegramWebApp ? '0' : '0' }}>
          <Routes>
            <Route path="/" element={<Dashboard user={user} isTelegramWebApp={isTelegramWebApp} />} />
            <Route path="/reports" element={<ReportList user={user} />} />
            <Route path="/reports/create" element={<CreateReport />} />
            <Route path="/reports/assigned" element={<AssignedReports />} />
            <Route path="/actions/my" element={<MyActions />} />
            <Route 
              path="/actions" 
              element={
                <ProtectedRoute allowedRoles={['operator', 'admin']}>
                  <ActionList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/actions/create" 
              element={
                <ProtectedRoute allowedRoles={['operator', 'admin']}>
                  <CreateAction />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/forms" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <FormBuilder />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/categories" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CategoryManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        {isTelegramWebApp && <TelegramNav user={user} />}
      </div>
    </BrowserRouter>
  );
}

export default App;
