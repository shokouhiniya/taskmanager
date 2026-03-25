import { useState } from 'react';
import api from '../api/axios';

export default function Login({ onLogin }: { onLogin: (token: string, user: any) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', { username, password });
      onLogin(response.data.access_token, response.data.user);
    } catch (error: any) {
      alert('❌ ' + (error.response?.data?.message || 'خطا در ورود'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="card" style={{ width: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '64px', marginBottom: '1rem' }}>📋</div>
          <h2 style={{ marginBottom: '0.5rem', color: '#212121' }}>سامانه مدیریت خبر</h2>
          <p style={{ color: '#757575', fontSize: '14px' }}>ورود به سیستم</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label>نام کاربری</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          
          <div className="field-group">
            <label>رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.875rem' }}>
            {loading ? '⏳ در حال ورود...' : '🔐 ورود به سامانه'}
          </button>
        </form>
      </div>
    </div>
  );
}
