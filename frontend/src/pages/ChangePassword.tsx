import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('❌ رمز عبور جدید و تکرار آن یکسان نیستند');
      return;
    }

    try {
      await api.put('/auth/change-password', {
        oldPassword,
        newPassword
      });
      alert('✅ رمز عبور با موفقیت تغییر کرد');
      navigate('/');
    } catch (error: any) {
      alert('❌ ' + (error.response?.data?.message || 'خطا در تغییر رمز عبور'));
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">🔐 تغییر رمز عبور</h1>
        <button onClick={() => navigate('/')} className="secondary">
          🏠 بازگشت
        </button>
      </div>

      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label>رمز عبور فعلی</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label>رمز عبور جدید</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="field-group">
            <label>تکرار رمز عبور جدید</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="success">
              ✅ تغییر رمز عبور
            </button>
            <button type="button" onClick={() => navigate('/')} className="secondary">
              ❌ انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
