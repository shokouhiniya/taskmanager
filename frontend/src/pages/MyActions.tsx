import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { IconChevron, IconInbox } from '../components/Icons';

export default function MyActions() {
  const [actions, setActions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { fetchActions(); }, []);
  const fetchActions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await api.get('/actions');
      setActions(res.data.filter((a: any) => a.assignedToId === user.id));
    } catch (e) { console.error(e); }
  };
  const updateStatus = async (id: string, status: string) => { try { await api.put(`/actions/${id}/status`, { status }); fetchActions(); } catch { alert('خطا'); } };

  const statusMap: Record<string, { label: string; cls: string }> = {
    in_progress: { label: 'در حال انجام', cls: 'badge-progress' },
    completed: { label: 'انجام شده', cls: 'badge-completed' },
    failed: { label: 'ناموفق', cls: 'badge-failed' },
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">اقدامات من</h1>
        <button onClick={() => navigate(-1)} className="ghost" style={{ padding: '0.375rem' }}><IconChevron /></button>
      </div>

      {actions.length === 0 ? (
        <div className="card empty-state">
          <div style={{ color: 'var(--text-tertiary)' }}><IconInbox /></div>
          <p style={{ marginTop: 8 }}>اقدامی محول نشده</p>
        </div>
      ) : actions.map((a: any) => {
        const st = statusMap[a.status] || { label: a.status, cls: '' };
        return (
          <div key={a.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{a.title}</span>
              <span className={`badge ${st.cls}`}>{st.label}</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{a.description}</p>
            <span className="badge badge-neutral" style={{ fontSize: 11 }}>{a.reports?.length || 0} خبر مرتبط</span>
            {a.status === 'in_progress' && (
              <div style={{ display: 'flex', gap: 6, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-light)' }}>
                <button onClick={() => updateStatus(a.id, 'completed')} className="success" style={{ flex: 1, fontSize: 12 }}>انجام شد</button>
                <button onClick={() => updateStatus(a.id, 'failed')} className="danger" style={{ flex: 1, fontSize: 12 }}>ناموفق</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
