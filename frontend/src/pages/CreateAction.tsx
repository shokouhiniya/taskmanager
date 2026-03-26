import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { IconChevron } from '../components/Icons';

export default function CreateAction() {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => { fetchReports(); fetchUsers(); }, []);
  const fetchReports = async () => { try { setReports((await api.get('/reports')).data.filter((r: any) => r.status === 'needs_action')); } catch (e) { console.error(e); } };
  const fetchUsers = async () => { try { setUsers((await api.get('/users')).data); } catch (e) { console.error(e); } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/actions', { title, description, assignedToId, reportIds: selectedReports });
      alert('اقدام ایجاد شد');
      navigate('/actions');
    } catch { alert('خطا'); }
  };

  const toggleReport = (id: string) => setSelectedReports(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">ایجاد اقدام</h1>
        <button onClick={() => navigate(-1)} className="ghost" style={{ padding: '0.375rem' }}><IconChevron /></button>
      </div>

      <div className="card" style={{ padding: '1.25rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label>عنوان</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان اقدام" required />
          </div>
          <div className="field-group">
            <label>توضیحات</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="شرح اقدام" required rows={3} />
          </div>
          <div className="field-group">
            <label>مسئول انجام</label>
            <select value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)} required>
              <option value="">انتخاب مسئول</option>
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>{u.name || u.phone} - {u.role === 'admin' ? 'مدیر' : u.role === 'operator' ? 'کارشناس' : 'کاربر'}</option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label>خبرهای مرتبط ({selectedReports.length})</label>
            <div style={{ maxHeight: 200, overflow: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.5rem' }}>
              {reports.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '1rem', fontSize: 12 }}>خبری نیازمند اقدام نیست</p>
              ) : reports.map((r: any) => (
                <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem', borderRadius: 6, cursor: 'pointer', background: selectedReports.includes(r.id) ? 'var(--accent-light)' : 'transparent', marginBottom: 4 }}>
                  <input type="checkbox" checked={selectedReports.includes(r.id)} onChange={() => toggleReport(r.id)} style={{ width: 'auto' }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{r.form?.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{r.category?.name}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="submit" className="success" style={{ flex: 1 }}>ایجاد</button>
            <button type="button" onClick={() => navigate('/actions')} className="secondary" style={{ flex: 1 }}>انصراف</button>
          </div>
        </form>
      </div>
    </div>
  );
}
