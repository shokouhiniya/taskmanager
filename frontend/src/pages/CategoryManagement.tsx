import { useState, useEffect } from 'react';
import api from '../api/axios';
import { IconPlus, IconTrash, IconFolder } from '../components/Icons';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => { fetchCategories(); }, []);
  const fetchCategories = async () => { try { setCategories((await api.get('/categories')).data); } catch (e) { console.error(e); } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name, description });
      setName(''); setDescription(''); setShowForm(false); fetchCategories();
    } catch { alert('خطا'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف شود؟')) return;
    try { await api.delete(`/categories/${id}`); fetchCategories(); } catch { alert('خطا'); }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">دسته‌بندی‌ها</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ fontSize: 12, padding: '0.375rem 0.75rem' }}>
          {showForm ? 'انصراف' : <><IconPlus /> جدید</>}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: '1.25rem', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>دسته‌بندی جدید</div>
          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label>نام</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="نام دسته‌بندی" required />
            </div>
            <div className="field-group">
              <label>توضیحات</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="توضیحات" rows={2} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="success" style={{ flex: 1 }}>ایجاد</button>
              <button type="button" onClick={() => setShowForm(false)} className="secondary" style={{ flex: 1 }}>انصراف</button>
            </div>
          </form>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="card empty-state"><p>دسته‌بندی‌ای نیست</p></div>
      ) : categories.map((c: any) => (
        <div key={c.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)', flexShrink: 0 }}>
            <IconFolder />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
            {c.description && <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{c.description}</div>}
          </div>
          <button onClick={() => handleDelete(c.id)} className="ghost" style={{ padding: 6, color: 'var(--danger)' }}><IconTrash /></button>
        </div>
      ))}
    </div>
  );
}
