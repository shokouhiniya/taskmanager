import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { IconChevron, IconFile } from '../components/Icons';

export default function CreateReport() {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchForms(); fetchCategories(); }, []);
  const fetchForms = async () => { try { setForms((await api.get('/forms')).data); } catch (e) { console.error(e); } };
  const fetchCategories = async () => { try { setCategories((await api.get('/categories')).data); } catch (e) { console.error(e); } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/reports', { formId: selectedForm.id, data: formData, categoryId });
      alert('خبر با موفقیت ثبت شد');
      navigate('/reports');
    } catch { alert('خطا در ثبت خبر'); }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">ثبت خبر جدید</h1>
        <button onClick={() => navigate(-1)} className="ghost" style={{ padding: '0.375rem' }}><IconChevron /></button>
      </div>

      <div className="card" style={{ padding: '1.25rem' }}>
        {!selectedForm ? (
          <>
            <label style={{ marginBottom: 12, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>نوع فرم را انتخاب کنید</label>
            {forms.length === 0 ? (
              <div className="empty-state"><p>فرمی موجود نیست</p></div>
            ) : forms.map((f: any) => (
              <div key={f.id} onClick={() => setSelectedForm(f)} className="card"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--border)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                  <IconFile />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{f.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{f.schema?.fields?.length || 0} فیلد</div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{selectedForm.title}</span>
              <button type="button" onClick={() => setSelectedForm(null)} className="ghost" style={{ fontSize: 12 }}>تغییر</button>
            </div>

            <div className="field-group">
              <label>دسته‌بندی</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                <option value="">انتخاب دسته‌بندی</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {selectedForm.schema?.fields?.map((field: any) => (
              <div key={field.name} className="field-group">
                <label>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea value={formData[field.name] || ''} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} required={field.required} rows={3} placeholder={field.label} />
                ) : (
                  <input type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'} value={formData[field.name] || ''} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} required={field.required} placeholder={field.label} />
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button type="submit" className="success" style={{ flex: 1 }}>ثبت خبر</button>
              <button type="button" onClick={() => navigate('/reports')} className="secondary" style={{ flex: 1 }}>انصراف</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
