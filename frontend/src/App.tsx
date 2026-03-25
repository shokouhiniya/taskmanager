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
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);

  useEffect(() => { initializeApp(); }, []);

  const initializeApp = async () => {
    const isTg = WebApp.platform !== 'unknown';
    setIsTelegramWebApp(isTg);

    if (isTg) {
      WebApp.ready();
      WebApp.expand();
      document.body.classList.add('telegram-webapp');
      WebApp.setHeaderColor('#4f46e5');
      WebApp.setBackgroundColor('#f0f2f5');

      const tgUser = WebApp.initDataUnsafe?.user;
      if (tgUser) {
        const isBale = window.location.hostname.includes('bale') || WebApp.platform === 'bale';
        const endpoint = isBale ? '/auth/bale' : '/auth/telegram';
        const idField = isBale ? 'baleId' : 'telegramId';
        try {
          const response = await api.post(endpoint, {
            [idField]: tgUser.id.toString(),
            firstName: tgUser.first_name, lastName: tgUser.last_name, username: tgUser.username,
          });
          handleLogin(response.data.access_token, response.data.user);
        } catch (error: any) {
          WebApp.showAlert(`خطا: ${error.response?.data?.message || error.message}`);
        }
      }
    } else {
      const savedUser = localStorage.getItem('user');
      if (savedUser) setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  };

  const handleLogin = (token: string, user: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token); setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    setToken(null); setUser(null);
    if (isTelegramWebApp) WebApp.close();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 13 }}>در حال بارگذاری...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!token && !isTelegramWebApp) return <Login onLogin={handleLogin} />;

  if (!token && isTelegramWebApp) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>خطا در احراز هویت</p>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 16 }}>لطفاً از طریق ربات وارد شوید</p>
          <button onClick={() => WebApp.close()} className="secondary">بستن</button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', paddingBottom: '70px' }}>
        {!isTelegramWebApp && <Navbar user={user} onLogout={handleLogout} />}
        <Routes>
          <Route path="/" element={<Dashboard user={user} isTelegramWebApp={isTelegramWebApp} />} />
          <Route path="/reports" element={<ReportList user={user} />} />
          <Route path="/reports/create" element={<CreateReport />} />
          <Route path="/reports/assigned" element={<AssignedReports />} />
          <Route path="/actions/my" element={<MyActions />} />
          <Route path="/actions" element={<ProtectedRoute allowedRoles={['operator', 'admin']}><ActionList /></ProtectedRoute>} />
          <Route path="/actions/create" element={<ProtectedRoute allowedRoles={['operator', 'admin']}><CreateAction /></ProtectedRoute>} />
          <Route path="/forms" element={<ProtectedRoute allowedRoles={['admin']}><FormBuilder /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute allowedRoles={['admin']}><CategoryManagement /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {isTelegramWebApp && <TelegramNav user={user} />}
      </div>
    </BrowserRouter>
  );
}

export default App;
