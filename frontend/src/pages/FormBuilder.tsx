import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { IconPlus, IconEdit, IconTrash, IconChevron } from '../components/Icons';

export default function FormBuilder() {
  const [forms, setForms] = useState([]);
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => { fetchForms(); }, []);
  const fetchForms = async () => { try { setForms((await api.get('/forms')).data); } catch (e) { console.error(e); } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) { await api.put(`/forms/${editingId}`, { title, schema: { fields } }); setEditingId(null); }
      else { await api.post('/forms', { title, schema: { fields } }); }
      setTitle(''); setFields([]); fetchForms();
    } catch { alert('خطا'); }
  };

  const handleEdit = (f: any) => { setEditingId(f.id); setTitle(f.title); setFields(f.schema?.fields || []); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleDelete = async (id: string) => { if (!confirm('حذف شود؟')) return; try { await api.delete(`/forms/${id}`); fetchForms(); } catch { alert('خطا'); } };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">فرم‌ساز</h1>
        <button onClick={() => navigate(-1)} className="ghost" style={{ padding: '0.375rem' }}><IconChevron /></button>
      </div>

      <div className="card" style={{ padding: '1.25rem', marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{editingId ? 'ویرایش فرم' : 'فرم جدید'}</div>
        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label>عنوان فرم</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان فرم" required />
          </div>

          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>فیلدها</div>
          {fields.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', padding: '1rem 0' }}>فیلدی اضافه نشده</p>}

          {fields.map((field, i) => (
            <div key={i} style={{ padding: '0.75rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', marginBottom: 8, position: 'relative' }}>
              <button type="button" onClick={() => setFields(fields.filter((_, idx) => idx !== i))} className="ghost"
                style={{ position: 'absolute', left: 8, top: 8, padding: 4, color: 'var(--danger)' }}><IconTrash /></button>
              <div style={{ display: 'grid', gap: 8 }}>
                <div><label style={{ fontSize: 11 }}>نام (انگلیسی)</label><input type="text" placeholder="field_name" value={field.name} onChange={(e) => { const f = [...fields]; f[i].name = e.target.value; setFields(f); }} /></div>
                <div><label style={{ fontSize: 11 }}>برچسب</label><input type="text" placeholder="برچسب فارسی" value={field.label} onChange={(e) => { const f = [...fields]; f[i].label = e.target.value; setFields(f); }} /></div>
                <div><label style={{ fontSize: 11 }}>نوع</label>
                  <select value={field.type} onChange={(e) => { const f = [...fields]; f[i].type = e.target.value; setFields(f); }}>
                    <option value="text">متن کوتاه</option><option value="textarea">متن بلند</option><option value="number">عدد</option><option value="date">تاریخ</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <button type="button" onClick={() => setFields([...fields, { name: '', label: '', type: 'text', required: false }])} className="secondary" style={{ width: '100%', marginBottom: 8 }}>
            <IconPlus /> افزودن فیلد
          </button>
          <button type="submit" disabled={fields.length === 0} className="success" style={{ width: '100%' }}>
            {editingId ? 'ذخیره تغییرات' : 'ذخیره فرم'}
          </button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setTitle(''); setFields([]); }} className="secondary" style={{ width: '100%', marginTop: 6 }}>انصراف</button>}
        </form>
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>فرم‌های موجود</div>
      {forms.length === 0 ? <div className="card empty-state"><p>فرمی نیست</p></div> : forms.map((f: any) => (
        <div key={f.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{f.title}</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{f.schema?.fields?.length || 0} فیلد</div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => handleEdit(f)} className="ghost" style={{ padding: 6, color: 'var(--warning)' }}><IconEdit /></button>
            <button onClick={() => handleDelete(f.id)} className="ghost" style={{ padding: 6, color: 'var(--danger)' }}><IconTrash /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
