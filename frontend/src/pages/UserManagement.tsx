import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { IconPlus, IconEdit, IconTrash, IconUser } from '../components/Icons';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({ username: '', password: '', phone: '', name: '', role: 'reporter' });
  const navigate = useNavigate();

  useEffect(() => { fetchUsers(); }, []);
  const fetchUsers = async () => { try { setUsers((await api.get('/users')).data); } catch (e) { console.error(e); } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, { phone: formData.phone, name: formData.name, role: formData.role, password: formData.password || undefined });
        cancelEdit();
      } else {
        await api.post('/users', formData);
        setShowForm(false); setFormData({ username: '', password: '', phone: '', name: '', role: 'reporter' });
      }
      fetchUsers();
    } catch (err: any) { alert(err.response?.data?.message || 'خطا'); }
  };

  const handleDelete = async (id: string) => { if (!confirm('حذف شود؟')) return; try { await api.delete(`/users/${id}`); fetchUsers(); } catch { alert('خطا'); } };
  const handleEdit = (u: any) => { setEditingUser(u); setFormData({ username: u.username, password: '', phone: u.phone, name: u.name, role: u.role }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const cancelEdit = () => { setEditingUser(null); setShowForm(false); setFormData({ username: '', password: '', phone: '', name: '', role: 'reporter' }); };

  const roleLabel = (r: string) => r === 'admin' ? 'مدیر' : r === 'operator' ? 'کارشناس' : 'کاربر';

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">کاربران</h1>
        <button onClick={() => showForm ? cancelEdit() : setShowForm(true)} style={{ fontSize: 12, padding: '0.375rem 0.75rem' }}>
          {showForm ? 'انصراف' : <><IconPlus /> جدید</>}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: '1.25rem', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{editingUser ? 'ویرایش کاربر' : 'کاربر جدید'}</div>
          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label>نام کاربری</label>
              <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required disabled={!!editingUser} />
            </div>
            <div className="field-group">
              <label>رمز عبور {editingUser && '(اختیاری)'}</label>
              <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editingUser} placeholder={editingUser ? 'خالی = بدون تغییر' : ''} />
            </div>
            <div className="field-group">
              <label>شماره موبایل</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required placeholder="09123456789" />
            </div>
            <div className="field-group">
              <label>نام</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="field-group">
              <label>نقش</label>
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="reporter">کاربر</option><option value="operator">کارشناس</option><option value="admin">مدیر</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="success" style={{ flex: 1 }}>{editingUser ? 'ذخیره' : 'ایجاد'}</button>
              <button type="button" onClick={cancelEdit} className="secondary" style={{ flex: 1 }}>انصراف</button>
            </div>
          </form>
        </div>
      )}

      {users.map((u: any) => (
        <div key={u.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
            <IconUser />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{u.username} · {roleLabel(u.role)}</div>
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            <button onClick={() => handleEdit(u)} className="ghost" style={{ padding: 6, color: 'var(--warning)' }}><IconEdit /></button>
            <button onClick={() => handleDelete(u.id)} className="ghost" style={{ padding: 6, color: 'var(--danger)' }}><IconTrash /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
