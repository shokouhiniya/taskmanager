import { useNavigate, useLocation } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';

export default function TelegramNav({ user }: { user: any }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = user?.role === 'reporter' 
    ? [
        { path: '/', icon: '🏠', label: 'خانه' },
        { path: '/reports/create', icon: '➕', label: 'ثبت' },
        { path: '/reports', icon: '📋', label: 'خبرها' },
        { path: '/reports/assigned', icon: '📬', label: 'ارجاعی' },
        { path: '/actions/my', icon: '⚡', label: 'اقدامات' },
      ]
    : user?.role === 'admin'
    ? [
        { path: '/', icon: '🏠', label: 'خانه' },
        { path: '/reports', icon: '📋', label: 'خبرها' },
        { path: '/forms', icon: '📝', label: 'فرم‌ها' },
        { path: '/categories', icon: '📁', label: 'دسته‌ها' },
        { path: '/users', icon: '👥', label: 'کاربران' },
      ]
    : [
        { path: '/', icon: '🏠', label: 'خانه' },
        { path: '/reports', icon: '📋', label: 'خبرها' },
        { path: '/actions', icon: '⚡', label: 'اقدامات' },
      ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(0, 0, 0, 0.08)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 4px 12px 4px',
      zIndex: 1000,
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              WebApp.HapticFeedback.impactOccurred('light');
            }}
            style={{
              background: isActive 
                ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(102, 126, 234, 0.15))' 
                : 'transparent',
              border: 'none',
              borderRadius: '16px',
              padding: '10px 8px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              flex: 1,
              maxWidth: '80px',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0 2px 8px rgba(124, 58, 237, 0.2)' : 'none',
            }}
          >
            <span style={{ 
              fontSize: '24px',
              filter: isActive ? 'none' : 'grayscale(0.3)',
              transition: 'all 0.2s ease',
            }}>
              {item.icon}
            </span>
            <span style={{ 
              fontSize: '11px', 
              color: isActive ? '#7c3aed' : '#9e9e9e',
              fontWeight: isActive ? 700 : 500,
              transition: 'all 0.2s ease',
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
