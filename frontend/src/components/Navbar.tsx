import { useNavigate, useLocation } from 'react-router-dom';
import { IconHome, IconFile, IconZap, IconGrid, IconFolder, IconUsers, IconLogout, IconInbox, IconList, IconLock } from './Icons';

export default function Navbar({ user, onLogout }: { user: any; onLogout: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => { onLogout(); navigate('/'); };

  const isActive = (path: string) => location.pathname === path;

  // Build nav items based on role
  const navItems: { path: string; icon: React.ReactNode; label: string }[] = [
    { path: '/', icon: <IconHome />, label: 'خانه' },
  ];

  if (user?.role === 'reporter') {
    navItems.push(
      { path: '/reports', icon: <IconFile />, label: 'خبرها' },
      { path: '/reports/assigned', icon: <IconInbox />, label: 'ارجاعی' },
      { path: '/actions/my', icon: <IconZap />, label: 'اقدامات' },
    );
  } else {
    navItems.push(
      { path: '/reports', icon: <IconList />, label: 'خبرها' },
      { path: '/actions', icon: <IconZap />, label: 'اقدامات' },
    );
  }

  if (user?.role === 'admin') {
    navItems.push(
      { path: '/forms', icon: <IconGrid />, label: 'فرم‌ها' },
      { path: '/users', icon: <IconUsers />, label: 'کاربران' },
    );
  }

  return (
    <>
      {/* Top header - minimal */}
      <header style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '0.625rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>خ</div>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>سامانه خبر</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name || user?.username}</div>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
              {user?.role === 'admin' ? 'مدیر' : user?.role === 'operator' ? 'کارشناس' : 'کاربر'}
            </div>
          </div>
          <button onClick={() => navigate('/change-password')} className="ghost" style={{ padding: 4, color: 'var(--text-tertiary)' }}><IconLock /></button>
          <button onClick={handleLogout} className="ghost" style={{ padding: 4, color: 'var(--text-tertiary)' }}><IconLogout /></button>
        </div>
      </header>

      {/* Bottom tab bar */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 430, margin: '0 auto',
        background: 'var(--surface)', borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-around', padding: '0.375rem 0 0.625rem', zIndex: 50,
      }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              style={{
                background: 'transparent', border: 'none', borderRadius: 'var(--radius-sm)',
                padding: '0.25rem 0.375rem', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 2, flex: 1,
                color: active ? 'var(--accent)' : 'var(--text-tertiary)', boxShadow: 'none',
              }}>
              <span style={{ width: 20, height: 20 }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
