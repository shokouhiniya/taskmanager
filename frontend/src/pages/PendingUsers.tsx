import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await api.get('/users/pending');
      setPendingUsers(response.data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string, role: string) => {
    if (!confirm(`آیا می‌خواهید این کاربر را با نقش "${getRoleName(role)}" تایید کنید؟`)) {
      return;
    }

    try {
      await api.put(`/users/${userId}/approve`, { role });
      alert('✅ کاربر با موفقیت تایید شد');
      fetchPendingUsers();
    } catch (error: any) {
      alert('❌ ' + (error.response?.data?.message || 'خطا در تایید کاربر'));
    }
  };

  const handleReject = async (userId: string) => {
    if (!confirm('آیا می‌خواهید این کاربر را رد کنید؟')) {
      return;
    }

    try {
      await api.put(`/users/${userId}/reject`);
      alert('✅ کاربر رد شد');
      fetchPendingUsers();
    } catch (error: any) {
      alert('❌ ' + (error.response?.data?.message || 'خطا در رد کاربر'));
    }
  };

  const getRoleName = (role: string) => {
    const roles: any = {
      'reporter': 'کاربر عادی',
      'operator': 'کارشناس',
      'admin': 'مدیر'
    };
    return roles[role] || role;
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '90px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem',
        position: 'sticky',
        top: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '1rem',
        margin: '-1.5rem -1.5rem 1.5rem -1.5rem',
        borderBottom: '1px solid #e0e0e0',
        zIndex: 10
      }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>👥 کاربران در انتظار تایید</h2>
        <span style={{ 
          background: '#ff9800', 
          color: 'white', 
          padding: '0.25rem 0.75rem', 
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: 'bold'
        }}>
          {pendingUsers.length}
        </span>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>✅</div>
          <p style={{ color: '#757575' }}>کاربری در انتظار تایید نیست</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pendingUsers.map((user) => (
            <div key={user.id} className="card">
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', marginBottom: '0.25rem' }}>
                      {user.name} {user.lastName}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#757575', margin: 0 }}>
                      {user.username}
                    </p>
                  </div>
                  <span style={{
                    background: '#ff9800',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    در انتظار
                  </span>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gap: '0.5rem',
                  padding: '0.75rem',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  fontSize: '13px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#757575' }}>📱 تلفن:</span>
                    <span style={{ fontWeight: 'bold', direction: 'ltr' }}>{user.phone}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#757575' }}>🆔 کد ملی:</span>
                    <span style={{ fontWeight: 'bold', direction: 'ltr' }}>{user.nationalId}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#757575' }}>📅 تاریخ ثبت:</span>
                    <span>{new Date(user.createdAt).toLocaleDateString('fa-IR')}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => handleApprove(user.id, 'reporter')}
                  style={{ 
                    width: '100%',
                    background: '#4caf50',
                    padding: '0.75rem'
                  }}
                >
                  ✅ تایید به عنوان کاربر عادی
                </button>
                <button
                  onClick={() => handleApprove(user.id, 'operator')}
                  style={{ 
                    width: '100%',
                    background: '#2196f3',
                    padding: '0.75rem'
                  }}
                >
                  👨‍💼 تایید به عنوان کارشناس
                </button>
                <button
                  onClick={() => handleApprove(user.id, 'admin')}
                  style={{ 
                    width: '100%',
                    background: '#9c27b0',
                    padding: '0.75rem'
                  }}
                >
                  👑 تایید به عنوان مدیر
                </button>
                <button
                  onClick={() => handleReject(user.id)}
                  className="secondary"
                  style={{ 
                    width: '100%',
                    padding: '0.75rem'
                  }}
                >
                  ❌ رد کردن
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
