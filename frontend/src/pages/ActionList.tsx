import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function ActionList() {
  const [actions, setActions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      const response = await api.get('/actions');
      setActions(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateStatus = async (actionId: string, status: string) => {
    try {
      await api.put(`/actions/${actionId}/status`, { status });
      fetchActions();
    } catch (error) {
      alert('خطا در تغییر وضعیت');
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'in_progress': return '⏳ در حال انجام';
      case 'completed': return '✅ انجام شده';
      case 'failed': return '❌ ناموفق';
      default: return status;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'in_progress': return 'badge badge-progress';
      case 'completed': return 'badge badge-completed';
      case 'failed': return 'badge badge-failed';
      default: return 'badge';
    }
  };

  return (
    <div className="container">
      <div className="page-header" style={{ flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
        <h1 className="page-title" style={{ fontSize: '18px' }}>⚡ لیست اقدامات</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => navigate('/actions/create')} className="success" style={{ flex: 1, fontSize: '13px', padding: '0.625rem 1rem' }}>
            ➕ جدید
          </button>
          <button onClick={() => navigate('/')} className="secondary" style={{ fontSize: '13px', padding: '0.625rem 1rem' }}>
            🏠
          </button>
        </div>
      </div>
      
      {actions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📭</div>
          <p style={{ color: '#757575', marginBottom: '1rem', fontSize: '14px' }}>هنوز اقدامی ثبت نشده است</p>
          <button onClick={() => navigate('/actions/create')} style={{ width: '100%' }}>
            ایجاد اولین اقدام
          </button>
        </div>
      ) : (
        actions.map((action: any) => (
          <div key={action.id} className="card">
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#212121', fontSize: '15px' }}>{action.title}</h3>
              <p style={{ color: '#616161', fontSize: '13px', marginBottom: '0.75rem' }}>{action.description}</p>
              
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                <span className={getStatusBadge(action.status)}>
                  {getStatusLabel(action.status)}
                </span>
                <span className="badge" style={{ background: 'rgba(245, 245, 245, 0.9)', color: '#616161' }}>
                  📊 {action.reports?.length || 0} خبر
                </span>
                <span className="badge" style={{ background: 'rgba(245, 245, 245, 0.9)', color: '#616161' }}>
                  👤 {action.assignedTo?.name || action.assignedTo?.phone}
                </span>
              </div>
            </div>
            
            {action.status === 'in_progress' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(240, 240, 240, 0.5)' }}>
                <button 
                  onClick={() => updateStatus(action.id, 'completed')}
                  className="success"
                  style={{ fontSize: '13px', padding: '0.625rem 1rem', width: '100%' }}
                >
                  ✅ انجام شد
                </button>
                <button 
                  onClick={() => updateStatus(action.id, 'failed')}
                  className="danger"
                  style={{ fontSize: '13px', padding: '0.625rem 1rem', width: '100%' }}
                >
                  ❌ ناموفق
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
