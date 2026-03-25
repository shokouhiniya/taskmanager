import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

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
      await api.post('/categories', { name, description });
      alert('✅ دسته‌بندی ایجاد شد');
      setName('');
      setDescription('');
      setShowForm(false);
      fetchCategories();
    } catch (error) {
      alert('❌ خطا در ایجاد دسته‌بندی');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) return;
    
    try {
      await api.delete(`/categories/${id}`);
      alert('✅ دسته‌بندی حذف شد');
      fetchCategories();
    } catch (error) {
      alert('❌ خطا در حذف دسته‌بندی');
    }
  };

  return (
    <div className="container">
      <div className="page-header" style={{ flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
        <h1 className="page-title" style={{ fontSize: '18px' }}>📁 مدیریت دسته‌بندی‌ها</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setShowForm(!showForm)} className="success" style={{ flex: 1, fontSize: '13px', padding: '0.625rem 1rem' }}>
            {showForm ? '❌ انصراف' : '➕ جدید'}
          </button>
          <button onClick={() => navigate('/')} className="secondary" style={{ fontSize: '13px', padding: '0.625rem 1rem' }}>
            🏠
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '16px', color: '#212121' }}>ایجاد دسته‌بندی جدید</h3>
          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label>نام دسته‌بندی</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: فنی"
                required
              />
            </div>

            <div className="field-group">
              <label>توضیحات</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات دسته‌بندی..."
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="submit" className="success" style={{ width: '100%' }}>
                ✅ ایجاد دسته‌بندی
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="secondary" style={{ width: '100%' }}>
                ❌ انصراف
              </button>
            </div>
          </form>
        </div>
      )}

      <h2 style={{ margin: '2rem 0 1rem', fontSize: '18px', color: '#212121' }}>📋 دسته‌بندی‌های موجود</h2>
      
      {categories.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📭</div>
          <p style={{ color: '#757575', fontSize: '14px' }}>هیچ دسته‌بندی وجود ندارد</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {categories.map((category: any) => (
            <div key={category.id} className="card">
              <div style={{ marginBottom: '0.75rem' }}>
                <h3 style={{ marginBottom: '0.5rem', color: '#212121', fontSize: '15px' }}>📁 {category.name}</h3>
                {category.description && (
                  <p style={{ fontSize: '13px', color: '#757575' }}>{category.description}</p>
                )}
              </div>
              <button 
                onClick={() => handleDelete(category.id)}
                className="danger"
                style={{ fontSize: '12px', padding: '0.5rem 0.875rem', width: '100%' }}
              >
                🗑️ حذف دسته‌بندی
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
