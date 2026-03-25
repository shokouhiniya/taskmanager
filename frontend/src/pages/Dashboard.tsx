import { Link } from 'react-router-dom';

export default function Dashboard({ user, isTelegramWebApp }: { user: any; isTelegramWebApp?: boolean }) {
  const isReporter = user?.role === 'reporter';
  const cardStyle = {
    cursor: 'pointer', 
    textAlign: 'center' as const,
    border: '2px solid transparent',
    transition: 'all 0.3s ease',
    padding: isTelegramWebApp ? '1.5rem 1rem' : '1.5rem'
  };
  
  const iconSize = isTelegramWebApp ? '40px' : '48px';
  const titleSize = isTelegramWebApp ? '16px' : '18px';
  
  return (
    <div className="container">
      {!isTelegramWebApp && (
        <div className="page-header">
          <h1 className="page-title">🏠 داشبورد</h1>
        </div>
      )}
      
      {isTelegramWebApp && (
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          padding: '1.25rem',
          marginBottom: '1rem',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#212121', margin: 0 }}>
            👋 سلام {user?.name || user?.username}
          </h1>
          <p style={{ fontSize: '13px', color: '#757575', marginTop: '0.5rem', marginBottom: 0 }}>
            {user?.role === 'admin' ? '🔑 مدیر سیستم' : user?.role === 'operator' ? '⚙️ کارشناس' : '👤 کاربر'}
          </p>
        </div>
      )}
      
      <div className="grid grid-3" style={{ gap: isTelegramWebApp ? '0.75rem' : '1rem' }}>
        <Link to="/reports/create" style={{ textDecoration: 'none' }}>
          <div className="card" style={cardStyle}>
            <div style={{ fontSize: iconSize, marginBottom: '0.75rem' }}>📝</div>
            <h3 style={{ color: '#212121', marginBottom: '0.5rem', fontSize: titleSize }}>ثبت خبر جدید</h3>
            <p style={{ color: '#757575', fontSize: '13px' }}>گزارش رخداد جدید</p>
          </div>
        </Link>

        <Link to="/reports" style={{ textDecoration: 'none' }}>
          <div className="card" style={cardStyle}>
            <div style={{ fontSize: iconSize, marginBottom: '0.75rem' }}>📊</div>
            <h3 style={{ color: '#212121', marginBottom: '0.5rem', fontSize: titleSize }}>
              {isReporter ? 'خبرهای من' : 'همه خبرها'}
            </h3>
            <p style={{ color: '#757575', fontSize: '13px' }}>
              {isReporter ? 'خبرهای ثبت شده' : 'مدیریت خبرها'}
            </p>
          </div>
        </Link>

        {isReporter && (
          <>
            <Link to="/reports/assigned" style={{ textDecoration: 'none' }}>
              <div className="card" style={cardStyle}>
                <div style={{ fontSize: iconSize, marginBottom: '0.75rem' }}>📬</div>
                <h3 style={{ color: '#212121', marginBottom: '0.5rem', fontSize: titleSize }}>خبرهای ارجاع شده</h3>
                <p style={{ color: '#757575', fontSize: '13px' }}>خبرهای محول شده به من</p>
              </div>
            </Link>
            <Link to="/actions/my" style={{ textDecoration: 'none' }}>
              <div className="card" style={cardStyle}>
                <div style={{ fontSize: iconSize, marginBottom: '0.75rem' }}>⚡</div>
                <h3 style={{ color: '#212121', marginBottom: '0.5rem', fontSize: titleSize }}>اقدامات من</h3>
                <p style={{ color: '#757575', fontSize: '13px' }}>اقدامات محول شده</p>
              </div>
            </Link>
          </>
        )}

        {(user?.role === 'operator' || user?.role === 'admin') && (
          <>
            <Link to="/actions" style={{ textDecoration: 'none' }}>
              <div className="card" style={cardStyle}>
                <div style={{ fontSize: iconSize, marginBottom: '0.75rem' }}>⚡</div>
                <h3 style={{ color: '#212121', marginBottom: '0.5rem', fontSize: titleSize }}>مدیریت اقدامات</h3>
                <p style={{ color: '#757575', fontSize: '13px' }}>پیگیری و ثبت اقدام</p>
              </div>
            </Link>
            <Link to="/actions/create" style={{ textDecoration: 'none' }}>
              <div className="card" style={cardStyle}>
                <div style={{ fontSize: iconSize, marginBottom: '0.75rem' }}>➕</div>
                <h3 style={{ color: '#212121', marginBottom: '0.5rem', fontSize: titleSize }}>ایجاد اقدام</h3>
                <p style={{ color: '#757575', fontSize: '13px' }}>تعریف اقدام برای خبرها</p>
              </div>
            </Link>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <Link to="/forms" style={{ textDecoration: 'none' }}>
              <div className="card" style={cardStyle}>
                <div style={{ fontSize: iconSize, marginBottom: '0.75rem' }}>🎨</div>
                <h3 style={{ color: '#212121', marginBottom: '0.5rem', fontSize: titleSize }}>فرم‌ساز</h3>
                <p style={{ color: '#757575', fontSize: '13px' }}>طراحی فرم‌های خبر</p>
              </div>
            </Link>
            <Link to="/users" style={{ textDecoration: 'none' }}>
              <div className="card" style={cardStyle}>
                <div style={{ fontSize: iconSize, marginBottom: '0.75rem' }}>👥</div>
                <h3 style={{ color: '#212121', marginBottom: '0.5rem', fontSize: titleSize }}>مدیریت کاربران</h3>
                <p style={{ color: '#757575', fontSize: '13px' }}>افزودن و مدیریت کاربران</p>
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
