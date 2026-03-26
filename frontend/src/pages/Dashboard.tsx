import { Link } from 'react-router-dom';
import { IconFile, IconList, IconInbox, IconZap, IconPlus, IconGrid, IconUsers, IconFolder } from '../components/Icons';

export default function Dashboard({ user, isTelegramWebApp }: { user: any; isTelegramWebApp?: boolean }) {
  const isReporter = user?.role === 'reporter';

  const MenuItem = ({ to, icon, title, desc, color }: { to: string; icon: React.ReactNode; title: string; desc: string; color: string }) => (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, background: color + '12',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{title}</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{desc}</div>
        </div>
        <svg width="16" height="16" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ transform: 'scaleX(-1)' }}><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </Link>
  );

  return (
    <div className="container">
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>سلام، {user?.name || user?.username}</h1>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
          {user?.role === 'admin' ? 'مدیر سیستم' : user?.role === 'operator' ? 'کارشناس' : 'کاربر'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <MenuItem to="/reports/create" icon={<IconPlus />} title="ثبت خبر جدید" desc="گزارش رخداد جدید" color="#4f46e5" />
        <MenuItem to="/reports" icon={isReporter ? <IconFile /> : <IconList />} title={isReporter ? 'خبرهای من' : 'همه خبرها'} desc={isReporter ? 'خبرهای ثبت شده' : 'مدیریت خبرها'} color="#2563eb" />

        {isReporter && (
          <>
            <MenuItem to="/reports/assigned" icon={<IconInbox />} title="خبرهای ارجاع شده" desc="خبرهای محول شده به من" color="#d97706" />
            <MenuItem to="/actions/my" icon={<IconZap />} title="اقدامات من" desc="اقدامات محول شده" color="#059669" />
          </>
        )}

        {(user?.role === 'operator' || user?.role === 'admin') && (
          <>
            <MenuItem to="/actions" icon={<IconZap />} title="مدیریت اقدامات" desc="پیگیری و ثبت اقدام" color="#059669" />
            <MenuItem to="/actions/create" icon={<IconPlus />} title="ایجاد اقدام" desc="تعریف اقدام برای خبرها" color="#7c3aed" />
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <MenuItem to="/forms" icon={<IconGrid />} title="فرم‌ساز" desc="طراحی فرم‌های خبر" color="#ec4899" />
            <MenuItem to="/categories" icon={<IconFolder />} title="دسته‌بندی‌ها" desc="مدیریت دسته‌بندی‌ها" color="#f59e0b" />
            <MenuItem to="/users" icon={<IconUsers />} title="مدیریت کاربران" desc="افزودن و مدیریت کاربران" color="#6366f1" />
          </>
        )}
      </div>
    </div>
  );
}
