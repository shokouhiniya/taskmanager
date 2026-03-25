import { useState } from 'react';
import api from '../api/axios';
import { IconLock } from '../components/Icons';

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
      alert(error.response?.data?.message || 'خطا در ورود');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: 'var(--accent)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', marginBottom: '1rem',
          }}>
            <IconLock />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>سامانه مدیریت خبر</h1>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>ورود به حساب کاربری</p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label>نام کاربری</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="نام کاربری" required />
            </div>
            <div className="field-group">
              <label>رمز عبور</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="رمز عبور" required />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.625rem', marginTop: '0.5rem' }}>
              {loading ? 'در حال ورود...' : 'ورود'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
