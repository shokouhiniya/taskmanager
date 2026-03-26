import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { IconChevron } from '../components/Icons';

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { alert('رمز عبور جدید و تکرار آن یکسان نیستند'); return; }
    try {
      await api.put('/auth/change-password', { oldPassword, newPassword });
      alert('رمز عبور تغییر کرد');
      navigate('/');
    } catch (err: any) { alert(err.response?.data?.message || 'خطا'); }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">تغییر رمز عبور</h1>
        <button onClick={() => navigate(-1)} className="ghost" style={{ padding: '0.375rem' }}><IconChevron /></button>
      </div>
      <div className="card" style={{ padding: '1.25rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="field-group"><label>رمز فعلی</label><input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required /></div>
          <div className="field-group"><label>رمز جدید</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} /></div>
          <div className="field-group"><label>تکرار رمز جدید</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} /></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="success" style={{ flex: 1 }}>تغییر رمز</button>
            <button type="button" onClick={() => navigate('/')} className="secondary" style={{ flex: 1 }}>انصراف</button>
          </div>
        </form>
      </div>
    </div>
  );
}
