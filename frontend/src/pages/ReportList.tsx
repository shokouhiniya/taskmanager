import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { IconPlus, IconInbox, IconClock } from '../components/Icons';

export default function ReportList({ user }: { user: any }) {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
    if (user?.role === 'admin') fetchUsers();
  }, []);

  const fetchReports = async () => {
    try {
      const endpoint = user?.role === 'reporter' ? '/reports/my' : '/reports';
      setReports((await api.get(endpoint)).data);
    } catch (e) { console.error(e); }
  };
  const fetchUsers = async () => { try { setUsers((await api.get('/users')).data); } catch (e) { console.error(e); } };
  const updateStatus = async (id: string, status: string) => { try { await api.put(`/reports/${id}/status`, { status }); fetchReports(); } catch { alert('خطا'); } };
  const assignReport = async (id: string) => {
    try { await api.put(`/reports/${id}/assign`, { assignedToId: selectedUserId }); setShowAssignModal(null); setSelectedUserId(''); fetchReports(); } catch { alert('خطا'); }
  };

  const statusMap: Record<string, { label: string; cls: string }> = {
    new: { label: 'جدید', cls: 'badge-new' },
    approved: { label: 'تایید شده', cls: 'badge-approved' },
    assigned: { label: 'ارجاع شده', cls: 'badge-assigned' },
    rejected: { label: 'رد شده', cls: 'badge-rejected' },
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">{user?.role === 'reporter' ? 'خبرهای من' : 'همه خبرها'}</h1>
        <button onClick={() => navigate('/reports/create')} className="success" style={{ fontSize: 12, padding: '0.375rem 0.75rem' }}>
          <IconPlus /> ثبت خبر
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="card empty-state">
          <div style={{ color: 'var(--text-tertiary)' }}><IconInbox /></div>
          <p style={{ marginTop: 8 }}>هنوز خبری ثبت نشده</p>
          <button onClick={() => navigate('/reports/create')} style={{ marginTop: 12, fontSize: 12 }}>ثبت اولین خبر</button>
        </div>
      ) : reports.map((r: any) => {
        const st = statusMap[r.status] || { label: r.status, cls: '' };
        const data = typeof r.data === 'string' ? JSON.parse(r.data || '{}') : r.data || {};
        return (
          <div key={r.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{r.form?.title}</span>
              <span className={`badge ${st.cls}`}>{st.label}</span>
            </div>

            <div style={{ background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', padding: '0.625rem', marginBottom: 8 }}>
              {Object.entries(data).map(([k, v]: any) => (
                <p key={k} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>{k}:</span> {v}
                </p>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center', fontSize: 11, color: 'var(--text-tertiary)' }}>
              {r.category && <span className="badge badge-neutral">{r.category.name}</span>}
              {r.assignedTo && <span className="badge badge-neutral">ارجاع: {r.assignedTo.name}</span>}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginRight: 'auto' }}>
                <IconClock />
                {new Date(r.createdAt).toLocaleDateString('fa-IR')}
              </span>
            </div>

            {user?.role === 'admin' && r.status === 'new' && (
              <div style={{ display: 'flex', gap: 6, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-light)' }}>
                <button onClick={() => updateStatus(r.id, 'approved')} className="success" style={{ flex: 1, fontSize: 12 }}>تایید</button>
                <button onClick={() => setShowAssignModal(r.id)} className="warning" style={{ flex: 1, fontSize: 12 }}>ارجاع</button>
                <button onClick={() => updateStatus(r.id, 'rejected')} className="danger" style={{ flex: 1, fontSize: 12 }}>رد</button>
              </div>
            )}

            {showAssignModal === r.id && (
              <div style={{ marginTop: 10, padding: '0.75rem', background: 'var(--accent-light)', borderRadius: 'var(--radius-sm)' }}>
                <label>ارجاع به:</label>
                <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} style={{ marginBottom: 8 }}>
                  <option value="">انتخاب کاربر</option>
                  {users.map((u: any) => <option key={u.id} value={u.id}>{u.name} ({u.username})</option>)}
                </select>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => assignReport(r.id)} disabled={!selectedUserId} className="success" style={{ flex: 1, fontSize: 12 }}>ارجاع</button>
                  <button onClick={() => setShowAssignModal(null)} className="secondary" style={{ flex: 1, fontSize: 12 }}>انصراف</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
