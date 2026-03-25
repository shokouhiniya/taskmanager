import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function CreateReport() {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
    fetchCategories();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await api.get('/forms');
      setForms(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/reports', {
        formId: selectedForm.id,
        data: formData,
        categoryId
      });
      alert('✅ خبر با موفقیت ثبت شد');
      navigate('/reports');
    } catch (error) {
      alert('❌ خطا در ثبت خبر');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="page-header" style={{ flexDirection: 'row', gap: '0.75rem', alignItems: 'center' }}>
        <h1 className="page-title" style={{ flex: 1, fontSize: '20px' }}>📝 ثبت خبر جدید</h1>
        <button onClick={() => navigate('/')} className="secondary" style={{ fontSize: '13px', padding: '0.5rem 1rem' }}>
          🏠 بازگشت
        </button>
      </div>
      
      <div className="card">
        {!selectedForm ? (
          <div>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '16px', color: '#212121' }}>انتخاب نوع فرم</h3>
            {forms.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📭</div>
                <p style={{ color: '#757575', fontSize: '14px' }}>هیچ فرمی موجود نیست</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {forms.map((form: any) => (
                  <div
                    key={form.id}
                    onClick={() => setSelectedForm(form)}
                    className="card"
                    style={{ 
                      cursor: 'pointer',
                      border: '2px solid rgba(224, 224, 224, 0.5)',
                      transition: 'all 0.2s ease',
                      padding: '1rem'
                    }}
                  >
                    <h4 style={{ marginBottom: '0.5rem', color: '#212121', fontSize: '15px' }}>{form.title}</h4>
                    <p style={{ fontSize: '13px', color: '#757575' }}>
                      📊 {form.schema?.fields?.length || 0} فیلد
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid rgba(240, 240, 240, 0.5)',
              gap: '0.75rem'
            }}>
              <h3 style={{ fontSize: '16px', color: '#212121', flex: 1 }}>📋 {selectedForm.title}</h3>
              <button 
                type="button" 
                onClick={() => setSelectedForm(null)} 
                className="secondary"
                style={{ fontSize: '12px', padding: '0.5rem 0.875rem', whiteSpace: 'nowrap' }}
              >
                🔄 تغییر
              </button>
            </div>
            
            <div className="field-group">
              <label>دسته‌بندی</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                <option value="">📁 انتخاب دسته‌بندی</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {selectedForm.schema?.fields?.map((field: any) => (
              <div key={field.name} className="field-group">
                <label>{field.label}</label>
                {field.type === 'text' && (
                  <input
                    type="text"
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    required={field.required}
                    placeholder={`${field.label} را وارد کنید`}
                  />
                )}
                {field.type === 'textarea' && (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    required={field.required}
                    rows={4}
                    placeholder={`${field.label} را وارد کنید`}
                  />
                )}
                {field.type === 'number' && (
                  <input
                    type="number"
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    required={field.required}
                    placeholder={`${field.label} را وارد کنید`}
                  />
                )}
                {field.type === 'date' && (
                  <input
                    type="date"
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    required={field.required}
                  />
                )}
              </div>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="submit" className="success" style={{ width: '100%' }}>
                ✅ ثبت خبر
              </button>
              <button type="button" onClick={() => navigate('/reports')} className="secondary" style={{ width: '100%' }}>
                ❌ انصراف
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
