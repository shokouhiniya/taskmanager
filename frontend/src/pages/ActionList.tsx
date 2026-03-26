import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { IconPlus, IconInbox, IconUser } from '../components/Icons';

export default function ActionList() {
  const [actions, setActions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { fetchActions(); }, []);
  const fetchActions = async () => { try { setActions((await api.get('/actions')).data); } catch (e) { console.error(e); } };
  const updateStatus = async (id: string, status: string) => { try { await api.put(`/actions/${id}/status`, { status }); fetchActions(); } catch { alert('خطا'); } };

  const statusMap: Record<string, { label: string; cls: string }> = {
    in_progress: { label: 'در حال انجام', cls: 'badge-progress' },
    completed: { label: 'انجام شده', cls: 'badge-completed' },
    failed: { label: 'ناموفق', cls: 'badge-failed' },
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">اقدامات</h1>
        <button onClick={() => navigate('/actions/create')} className="success" style={{ fontSize: 12, padding: '0.375rem 0.75rem' }}>
          <IconPlus /> جدید
        </button>
      </div>

      {actions.length === 0 ? (
        <div className="card empty-state">
          <div style={{ color: 'var(--text-tertiary)' }}><IconInbox /></div>
          <p style={{ marginTop: 8 }}>اقدامی ثبت نشده</p>
          <button onClick={() => navigate('/actions/create')} style={{ marginTop: 12, fontSize: 12 }}>ایجاد اقدام</button>
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
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', fontSize: 11 }}>
              <span className="badge badge-neutral">{a.reports?.length || 0} خبر</span>
              {a.assignedTo && <span className="badge badge-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><IconUser />{a.assignedTo.name}</span>}
            </div>
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
