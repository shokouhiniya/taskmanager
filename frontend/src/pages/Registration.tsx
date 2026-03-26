import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Registration({ user, onRegistrationComplete }: { user: any; onRegistrationComplete: () => void }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    lastName: '',
    nationalId: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // اعتبارسنجی کد ملی (10 رقم)
    if (formData.nationalId.length !== 10 || !/^\d+$/.test(formData.nationalId)) {
      setError('کد ملی باید 10 رقم باشد');
      setLoading(false);
      return;
    }

    // اعتبارسنجی شماره تلفن (11 رقم شروع با 09)
    if (!/^09\d{9}$/.test(formData.phone)) {
      setError('شماره تلفن باید 11 رقم و با 09 شروع شود');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/complete-registration', formData);
      alert('✅ ' + response.data.message);
      onRegistrationComplete();
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.message || 'خطا در ثبت اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem',
      paddingBottom: '90px'
    }}>
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '0.5rem' }}>📝</div>
          <h2 style={{ fontSize: '20px', marginBottom: '0.5rem', color: '#212121' }}>تکمیل اطلاعات</h2>
          <p style={{ color: '#757575', fontSize: '14px' }}>
            لطفاً اطلاعات خود را برای تایید نهایی وارد کنید
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem',
            background: '#ffebee',
            color: '#c62828',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label>نام *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="علی"
              required
            />
          </div>

          <div className="field-group">
            <label>نام خانوادگی *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="احمدی"
              required
            />
          </div>

          <div className="field-group">
            <label>کد ملی *</label>
            <input
              type="text"
              value={formData.nationalId}
              onChange={(e) => setFormData({ ...formData, nationalId: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              placeholder="1234567890"
              maxLength={10}
              required
            />
            <small style={{ color: '#757575', fontSize: '12px' }}>10 رقم</small>
          </div>

          <div className="field-group">
            <label>شماره تلفن *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 11) })}
              placeholder="09123456789"
              maxLength={11}
              required
            />
            <small style={{ color: '#757575', fontSize: '12px' }}>11 رقم، شروع با 09</small>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.875rem',
              marginTop: '0.5rem'
            }}
          >
            {loading ? '⏳ در حال ثبت...' : '✅ ثبت اطلاعات'}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#e3f2fd',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#1565c0'
        }}>
          <strong>💡 توجه:</strong><br/>
          اطلاعات شما پس از ثبت، توسط مدیر سیستم بررسی و تایید خواهد شد.
        </div>
      </div>
    </div>
  );
}
