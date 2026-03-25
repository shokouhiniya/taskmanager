import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function MyActions() {
  const [actions, setActions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      const response = await api.get('/actions');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setActions(response.data.filter((a: any) => a.assignedToId === user.id));
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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'in_progress': return 'badge badge-progress';
      case 'completed': return 'badge badge-completed';
      case 'failed': return 'badge badge-failed';
      default: return 'badge';
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

  return (
    <div className="container">
      <div className="page-header" style={{ flexDirection: 'row', gap: '0.75rem', alignItems: 'center' }}>
        <h1 className="page-title" style={{ flex: 1, fontSize: '20px' }}>⚡ اقدامات من</h1>
        <button onClick={() => navigate('/')} className="secondary" style={{ fontSize: '13px', padding: '0.5rem 1rem' }}>
          🏠
        </button>
      </div>
      
      {actions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📭</div>
          <p style={{ color: '#757575', fontSize: '14px' }}>هیچ اقدامی به شما محول نشده است</p>
        </div>
      ) : (
        actions.map((action: any) => (
          <div key={action.id} className="card">
            <h3 style={{ marginBottom: '0.75rem', color: '#212121' }}>{action.title}</h3>
            <p style={{ color: '#616161', fontSize: '14px', marginBottom: '1rem' }}>{action.description}</p>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span className={getStatusBadge(action.status)}>
                {getStatusLabel(action.status)}
              </span>
              <span className="badge" style={{ background: 'rgba(245, 245, 245, 0.9)', color: '#616161' }}>
                📊 {action.reports?.length || 0} خبر مرتبط
              </span>
            </div>
            
            {action.status === 'in_progress' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(224, 224, 224, 0.5)' }}>
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
