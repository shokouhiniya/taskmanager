import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }: { user: any; onLogout: () => void }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav style={{ 
      background: 'rgba(255, 255, 255, 0.95)', 
      color: '#1976d2', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '1rem', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#1976d2' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>📋 سامانه مدیریت خبر</h2>
          </Link>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/" style={{ color: '#1976d2', textDecoration: 'none', fontSize: '14px', fontWeight: 600, opacity: 0.8 }}>
              داشبورد
            </Link>
            {user?.role === 'reporter' ? (
              <>
                <Link to="/reports" style={{ color: '#1976d2', textDecoration: 'none', fontSize: '14px', fontWeight: 600, opacity: 0.8 }}>
                  خبرهای من
                </Link>
                <Link to="/reports/assigned" style={{ color: '#1976d2', textDecoration: 'none', fontSize: '14px', fontWeight: 600, opacity: 0.8 }}>
                  خبرهای ارجاع شده
                </Link>
                <Link to="/actions/my" style={{ color: '#1976d2', textDecoration: 'none', fontSize: '14px', fontWeight: 600, opacity: 0.8 }}>
                  اقدامات من
                </Link>
              </>
            ) : (
              <>
                <Link to="/reports" style={{ color: '#1976d2', textDecoration: 'none', fontSize: '14px', fontWeight: 600, opacity: 0.8 }}>
                  همه خبرها
                </Link>
                <Link to="/actions" style={{ color: '#1976d2', textDecoration: 'none', fontSize: '14px', fontWeight: 600, opacity: 0.8 }}>
                  اقدامات
                </Link>
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <Link to="/forms" style={{ color: '#1976d2', textDecoration: 'none', fontSize: '14px', fontWeight: 600, opacity: 0.8 }}>
                  فرم‌ساز
                </Link>
                <Link to="/categories" style={{ color: '#1976d2', textDecoration: 'none', fontSize: '14px', fontWeight: 600, opacity: 0.8 }}>
                  دسته‌بندی‌ها
                </Link>
                <Link to="/users" style={{ color: '#1976d2', textDecoration: 'none', fontSize: '14px', fontWeight: 600, opacity: 0.8 }}>
                  کاربران
                </Link>
              </>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '14px', color: '#424242' }}>
            <div style={{ fontWeight: 600 }}>{user?.name || user?.username}</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              {user?.role === 'admin' ? 'مدیر' : user?.role === 'operator' ? 'کارشناس' : 'کاربر'}
            </div>
          </div>
          <button 
            onClick={() => navigate('/change-password')}
            style={{ 
              background: 'rgba(25, 118, 210, 0.1)', 
              color: '#1976d2',
              padding: '0.5rem 1rem',
              fontSize: '13px'
            }}
          >
            🔐 تغییر رمز
          </button>
          <button 
            onClick={handleLogout} 
            className="danger"
            style={{ 
              padding: '0.5rem 1rem',
              fontSize: '13px'
            }}
          >
            خروج
          </button>
        </div>
      </div>
    </nav>
  );
}
