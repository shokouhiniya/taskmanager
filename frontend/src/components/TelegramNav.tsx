import { useNavigate, useLocation } from 'react-router-dom';
import { IconHome, IconPlus, IconFile, IconInbox, IconZap, IconList, IconGrid, IconFolder, IconUsers } from './Icons';

export default function TelegramNav({ user }: { user: any }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = user?.role === 'reporter'
    ? [
        { path: '/', icon: <IconHome />, label: 'خانه' },
        { path: '/reports/create', icon: <IconPlus />, label: 'ثبت' },
        { path: '/reports', icon: <IconFile />, label: 'خبرها' },
        { path: '/reports/assigned', icon: <IconInbox />, label: 'ارجاعی' },
        { path: '/actions/my', icon: <IconZap />, label: 'اقدامات' },
      ]
    : user?.role === 'admin'
    ? [
        { path: '/', icon: <IconHome />, label: 'خانه' },
        { path: '/reports', icon: <IconList />, label: 'خبرها' },
        { path: '/forms', icon: <IconGrid />, label: 'فرم‌ها' },
        { path: '/categories', icon: <IconFolder />, label: 'دسته‌ها' },
        { path: '/users', icon: <IconUsers />, label: 'کاربران' },
      ]
    : [
        { path: '/', icon: <IconHome />, label: 'خانه' },
        { path: '/reports', icon: <IconList />, label: 'خبرها' },
        { path: '/actions', icon: <IconZap />, label: 'اقدامات' },
      ];

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 430, margin: '0 auto',
      background: 'var(--surface)', borderTop: '1px solid var(--border)',
      display: 'flex', justifyContent: 'space-around', padding: '0.5rem 0.25rem 0.75rem', zIndex: 50,
    }}>
      {navItems.map((item) => {
        const active = location.pathname === item.path;
        return (
          <button key={item.path} onClick={() => navigate(item.path)}
            style={{
              background: 'transparent', border: 'none', borderRadius: 'var(--radius-sm)',
              padding: '0.375rem 0.5rem', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 2, flex: 1, color: active ? 'var(--accent)' : 'var(--text-tertiary)',
              boxShadow: 'none',
            }}>
            <span style={{ width: 22, height: 22 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
