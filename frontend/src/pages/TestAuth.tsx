import { useEffect, useState } from 'react';

export default function TestAuth() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    setToken(localStorage.getItem('token') || 'هیچ token یافت نشد');
    setUser(localStorage.getItem('user') || 'هیچ user یافت نشد');
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>تست احراز هویت</h2>
        <div style={{ marginTop: '1rem' }}>
          <h4>Token:</h4>
          <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto', fontSize: '12px' }}>
            {token}
          </pre>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <h4>User:</h4>
          <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto', fontSize: '12px' }}>
            {user}
          </pre>
        </div>
        <button onClick={() => {
          localStorage.clear();
          window.location.reload();
        }} style={{ marginTop: '1rem' }}>
          پاک کردن و Refresh
        </button>
      </div>
    </div>
  );
}
