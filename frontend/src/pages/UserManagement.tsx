import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone: '',
    name: '',
    role: 'reporter'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchPendingCount();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchPendingCount = async () => {
    try {
      const response = await api.get('/users/pending');
      setPendingCount(response.data.length);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // ویرایش کاربر
        await api.put(`/users/${editingUser.id}`, {
          phone: formData.phone,
          name: formData.name,
          role: formData.role,
          password: formData.password || undefined
        });
        alert('✅ کاربر با موفقیت ویرایش شد');
        cancelEdit();
      } else {
        // ایجاد کاربر جدید
        await api.post('/users', formData);
        alert('✅ کاربر با موفقیت ایجاد شد');
        setShowForm(false);
        setFormData({ username: '', password: '', phone: '', name: '', role: 'reporter' });
      }
      fetchUsers();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || (editingUser ? 'خطا در ویرایش کاربر' : 'خطا در ایجاد کاربر');
      alert(`❌ ${errorMsg}`);
      console.error('User operation error:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('آیا از حذف این کاربر اطمینان دارید؟')) return;
    
    try {
      await api.delete(`/users/${userId}`);
      alert('✅ کاربر حذف شد');
      fetchUsers();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'خطا در حذف کاربر';
      alert(`❌ ${errorMsg}`);
      console.error('Delete user error:', error);
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      phone: user.phone,
      name: user.name,
      role: user.role
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      alert('✅ نقش کاربر تغییر کرد');
      fetchUsers();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'خطا در تغییر نقش';
      alert(`❌ ${errorMsg}`);
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setShowForm(false);
    setFormData({ username: '', password: '', phone: '', name: '', role: 'reporter' });
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'admin': return '👑 مدیر';
      case 'operator': return '⚙️ کارشناس';
      case 'reporter': return '👤 کاربر';
      default: return role;
    }
  };

  return (
    <div className="container">
      <div className="page-header" style={{ flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
        <h1 className="page-title" style={{ fontSize: '18px' }}>👥 مدیریت کاربران</h1>
        
        {pendingCount > 0 && (
          <div 
            onClick={() => navigate('/users/pending')}
            style={{
              padding: '0.875rem',
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
              color: 'white',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                ⏳ کاربران در انتظار تایید
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                برای مشاهده و تایید کلیک کنید
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.3)',
              padding: '0.5rem 0.875rem',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              {pendingCount}
            </div>
          </div>
        )}
        
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
          <h3 style={{ marginBottom: '1.5rem', fontSize: '16px', color: '#212121' }}>
            {editingUser ? '✏️ ویرایش کاربر' : 'ایجاد کاربر جدید'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label>نام کاربری</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="مثال: ali.ahmadi"
                required
                disabled={!!editingUser}
              />
              {editingUser && (
                <p style={{ fontSize: '12px', color: '#757575', marginTop: '0.25rem' }}>
                  نام کاربری قابل تغییر نیست
                </p>
              )}
            </div>

            <div className="field-group">
              <label>رمز عبور {editingUser && '(خالی بگذارید اگر نمی‌خواهید تغییر دهید)'}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingUser ? 'رمز عبور جدید (اختیاری)' : 'رمز عبور اولیه'}
                required={!editingUser}
              />
            </div>

            <div className="field-group">
              <label>شماره موبایل</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="09123456789"
                required
              />
            </div>

            <div className="field-group">
              <label>نام و نام خانوادگی</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="علی احمدی"
                required
              />
            </div>

            <div className="field-group">
              <label>نقش کاربری</label>
              <select 
                value={formData.role} 
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="reporter">👤 کاربر (فقط ثبت خبر)</option>
                <option value="operator">⚙️ کارشناس (مدیریت خبرها و اقدامات)</option>
                <option value="admin">👑 مدیر (دسترسی کامل)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="submit" className="success" style={{ width: '100%' }}>
                ✅ {editingUser ? 'ذخیره تغییرات' : 'ایجاد کاربر'}
              </button>
              <button type="button" onClick={cancelEdit} className="secondary" style={{ width: '100%' }}>
                ❌ انصراف
              </button>
            </div>
          </form>
        </div>
      )}

      <h2 style={{ margin: '2rem 0 1rem', fontSize: '18px', color: '#212121' }}>📋 لیست کاربران</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {users.map((user: any) => (
          <div key={user.id} className="card">
            <div style={{ marginBottom: '0.75rem' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#212121', fontSize: '15px' }}>{user.name}</h3>
              <p style={{ fontSize: '13px', color: '#757575', marginBottom: '0.5rem' }}>
                🔑 {user.username}
              </p>
              <p style={{ fontSize: '13px', color: '#757575', marginBottom: '0.75rem' }}>
                📱 {user.phone}
              </p>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '12px', marginBottom: '0.5rem' }}>نقش کاربری:</label>
                <select 
                  value={user.role}
                  onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                  style={{ fontSize: '13px', padding: '0.5rem' }}
                >
                  <option value="reporter">👤 کاربر</option>
                  <option value="operator">⚙️ کارشناس</option>
                  <option value="admin">👑 مدیر</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => handleEdit(user)}
                className="warning"
                style={{ fontSize: '12px', padding: '0.5rem 0.875rem', flex: 1 }}
              >
                ✏️ ویرایش
              </button>
              <button 
                onClick={() => handleDelete(user.id)}
                className="danger"
                style={{ fontSize: '12px', padding: '0.5rem 0.875rem', flex: 1 }}
              >
                🗑️ حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
