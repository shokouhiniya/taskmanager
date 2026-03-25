import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function FormBuilder() {
  const [forms, setForms] = useState([]);
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await api.get('/forms');
      setForms(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addField = () => {
    setFields([...fields, { name: '', label: '', type: 'text', required: false }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/forms/${editingId}`, { title, schema: { fields } });
        alert('✅ فرم با موفقیت ویرایش شد');
        setEditingId(null);
      } else {
        await api.post('/forms', { title, schema: { fields } });
        alert('✅ فرم با موفقیت ایجاد شد');
      }
      setTitle('');
      setFields([]);
      fetchForms();
    } catch (error) {
      alert('❌ خطا در ذخیره فرم');
      console.error(error);
    }
  };

  const handleEdit = (form: any) => {
    setEditingId(form.id);
    setTitle(form.title);
    setFields(form.schema?.fields || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (formId: string) => {
    if (!confirm('آیا از حذف این فرم اطمینان دارید؟')) return;
    
    try {
      await api.delete(`/forms/${formId}`);
      alert('✅ فرم حذف شد');
      fetchForms();
    } catch (error) {
      alert('❌ خطا در حذف فرم');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setFields([]);
  };

  return (
    <div className="container">
      <div className="page-header" style={{ flexDirection: 'row', gap: '0.75rem', alignItems: 'center' }}>
        <h1 className="page-title" style={{ flex: 1, fontSize: '20px' }}>🎨 فرم‌ساز</h1>
        <button onClick={() => navigate('/')} className="secondary" style={{ fontSize: '13px', padding: '0.5rem 1rem' }}>
          🏠
        </button>
      </div>
      
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '16px', color: '#212121' }}>
          {editingId ? '✏️ ویرایش فرم' : '➕ ایجاد فرم جدید'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label>عنوان فرم</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: گزارش مشکل فنی"
              required
            />
          </div>

          <h4 style={{ marginBottom: '1rem', fontSize: '15px', color: '#424242' }}>فیلدهای فرم</h4>
          
          {fields.length === 0 && (
            <div style={{ 
              padding: '2rem', 
              textAlign: 'center', 
              background: 'rgba(250, 250, 250, 0.8)', 
              borderRadius: '12px',
              marginBottom: '1rem',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '0.5rem' }}>📝</div>
              <p style={{ color: '#757575' }}>هنوز فیلدی اضافه نشده</p>
            </div>
          )}
          
          {fields.map((field, index) => (
            <div key={index} style={{ 
              marginBottom: '1rem', 
              padding: '1rem', 
              background: 'rgba(250, 250, 250, 0.8)', 
              borderRadius: '12px', 
              position: 'relative',
              border: '1px solid rgba(224, 224, 224, 0.5)',
              backdropFilter: 'blur(10px)'
            }}>
              <button
                type="button"
                onClick={() => setFields(fields.filter((_, i) => i !== index))}
                className="danger"
                style={{ 
                  position: 'absolute', 
                  left: '0.75rem', 
                  top: '0.75rem',
                  padding: '0.375rem 0.625rem',
                  fontSize: '11px'
                }}
              >
                🗑️
              </button>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '13px' }}>نام فیلد (انگلیسی)</label>
                <input
                  type="text"
                  placeholder="مثال: title"
                  value={field.name}
                  onChange={(e) => {
                    const newFields = [...fields];
                    newFields[index].name = e.target.value;
                    setFields(newFields);
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '13px' }}>برچسب فیلد (فارسی)</label>
                <input
                  type="text"
                  placeholder="مثال: عنوان"
                  value={field.label}
                  onChange={(e) => {
                    const newFields = [...fields];
                    newFields[index].label = e.target.value;
                    setFields(newFields);
                  }}
                />
              </div>
              
              <div>
                <label style={{ fontSize: '13px' }}>نوع فیلد</label>
                <select
                  value={field.type}
                  onChange={(e) => {
                    const newFields = [...fields];
                    newFields[index].type = e.target.value;
                    setFields(newFields);
                  }}
                >
                  <option value="text">📝 متن کوتاه</option>
                  <option value="textarea">📄 متن بلند</option>
                  <option value="number">🔢 عدد</option>
                  <option value="date">📅 تاریخ</option>
                </select>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={addField} className="success" style={{ width: '100%' }}>
              ➕ افزودن فیلد
            </button>
            <button type="submit" disabled={fields.length === 0} style={{ width: '100%' }}>
              💾 {editingId ? 'ذخیره تغییرات' : 'ذخیره فرم'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="secondary" style={{ width: '100%' }}>
                ❌ انصراف
              </button>
            )}
          </div>
        </form>
      </div>

      <h2 style={{ margin: '2rem 0 1rem', fontSize: '18px', color: '#212121' }}>📋 فرم‌های موجود</h2>
      
      {forms.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📭</div>
          <p style={{ color: '#757575', fontSize: '14px' }}>هنوز فرمی ایجاد نشده است</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {forms.map((form: any) => (
            <div key={form.id} className="card">
              <div style={{ marginBottom: '0.75rem' }}>
                <h3 style={{ marginBottom: '0.5rem', color: '#212121', fontSize: '15px' }}>{form.title}</h3>
                <p style={{ fontSize: '13px', color: '#757575' }}>
                  📊 تعداد فیلدها: {form.schema?.fields?.length || 0}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleEdit(form)}
                  className="warning"
                  style={{ fontSize: '12px', padding: '0.5rem 0.875rem', flex: 1 }}
                >
                  ✏️ ویرایش
                </button>
                <button 
                  onClick={() => handleDelete(form.id)}
                  className="danger"
                  style={{ fontSize: '12px', padding: '0.5rem 0.875rem', flex: 1 }}
                >
                  🗑️ حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
