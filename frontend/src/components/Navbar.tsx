import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IconHome, IconFile, IconZap, IconGrid, IconFolder, IconUsers, IconLock, IconLogout, IconInbox, IconList } from './Icons';

export default function Navbar({ user, onLogout }: { user: any; onLogout: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { onLogout(); navigate('/'); };

  const isActive = (path: string) => location.pathname === path;

  const linkStyle = (path: string): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '0.375rem',
    color: isActive(path) ? 'var(--accent)' : 'var(--text-secondary)',
    textDecoration: 'none', fontSize: '13px', fontWeight: isActive(path) ? 600 : 400,
    padding: '0.375rem 0.625rem', borderRadius: 'var(--radius-sm)',
    background: isActive(path) ? 'var(--accent-light)' : 'transparent',
    transition: 'all var(--transition)',
  });

  return (
    <nav style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700 }}>خ</div>
            <span style={{ fontSize: 14, fontWeight: 700 }}>سامانه خبر</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ textAlign: 'left', fontSize: 12, color: 'var(--text-secondary)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name || user?.username}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                {user?.role === 'admin' ? 'مدیر' : user?.role === 'operator' ? 'کارشناس' : 'کاربر'}
              </div>
            </div>
            <button onClick={handleLogout} className="ghost" style={{ padding: '0.375rem', color: 'var(--text-tertiary)' }}>
              <IconLogout />
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: 2 }}>
          <Link to="/" style={linkStyle('/')}><IconHome /> داشبورد</Link>
          {user?.role === 'reporter' ? (
            <>
              <Link to="/reports" style={linkStyle('/reports')}><IconFile /> خبرها</Link>
              <Link to="/reports/assigned" style={linkStyle('/reports/assigned')}><IconInbox /> ارجاعی</Link>
              <Link to="/actions/my" style={linkStyle('/actions/my')}><IconZap /> اقدامات</Link>
            </>
          ) : (
            <>
              <Link to="/reports" style={linkStyle('/reports')}><IconList /> خبرها</Link>
              <Link to="/actions" style={linkStyle('/actions')}><IconZap /> اقدامات</Link>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <Link to="/forms" style={linkStyle('/forms')}><IconGrid /> فرم‌ها</Link>
              <Link to="/categories" style={linkStyle('/categories')}><IconFolder /> دسته‌ها</Link>
              <Link to="/users" style={linkStyle('/users')}><IconUsers /> کاربران</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
