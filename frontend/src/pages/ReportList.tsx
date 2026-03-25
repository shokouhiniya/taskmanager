import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function ReportList({ user }: { user: any }) {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, []);

  const fetchReports = async () => {
    try {
      const endpoint = user?.role === 'reporter' ? '/reports/my' : '/reports';
      const response = await api.get(endpoint);
      setReports(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateStatus = async (reportId: string, status: string) => {
    try {
      await api.put(`/reports/${reportId}/status`, { status });
      fetchReports();
    } catch (error) {
      alert('خطا در تغییر وضعیت');
    }
  };

  const assignReport = async (reportId: string) => {
    try {
      await api.put(`/reports/${reportId}/assign`, { assignedToId: selectedUserId });
      alert('✅ خبر با موفقیت ارجاع شد');
      setShowAssignModal(null);
      setSelectedUserId('');
      fetchReports();
    } catch (error) {
      alert('❌ خطا در ارجاع خبر');
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'new': return '🆕 جدید';
      case 'approved': return '✅ تایید شده';
      case 'assigned': return '📬 ارجاع شده';
      case 'rejected': return '❌ رد شده';
      default: return status;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new': return 'badge badge-new';
      case 'approved': return 'badge badge-approved';
      case 'assigned': return 'badge badge-assigned';
      case 'rejected': return 'badge badge-rejected';
      default: return 'badge';
    }
  };

  return (
    <div className="container">
      <div className="page-header" style={{ flexDirection: 'column', gap: '1rem', alignItems: 'stretch' }}>
        <h1 className="page-title" style={{ fontSize: '20px' }}>
          {user?.role === 'reporter' ? '📝 خبرهای من' : '📊 همه خبرها'}
        </h1>
        <button onClick={() => navigate('/reports/create')} className="success" style={{ width: '100%' }}>
          ➕ ثبت خبر جدید
        </button>
      </div>
      
      {reports.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '64px', marginBottom: '1rem' }}>📭</div>
          <p style={{ color: '#757575', marginBottom: '1rem' }}>هنوز خبری ثبت نشده است</p>
          <button onClick={() => navigate('/reports/create')}>
            ثبت اولین خبر
          </button>
        </div>
      ) : (
        reports.map((report: any) => (
          <div key={report.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '0.75rem', color: '#212121' }}>{report.form?.title}</h3>
                
                <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(250, 250, 250, 0.8)', borderRadius: '12px' }}>
                  {Object.entries(typeof report.data === 'string' ? JSON.parse(report.data || '{}') : report.data || {}).map(([key, value]: any) => (
                    <p key={key} style={{ fontSize: '14px', color: '#616161', marginBottom: '0.5rem' }}>
                      <strong>{key}:</strong> {value}
                    </p>
                  ))}
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <span className={getStatusBadge(report.status)}>
                    {getStatusLabel(report.status)}
                  </span>
                  <span className="badge" style={{ background: 'rgba(245, 245, 245, 0.9)', color: '#616161' }}>
                    📁 {report.category?.name}
                  </span>
                  {report.assignedTo && (
                    <span className="badge" style={{ background: 'rgba(245, 245, 245, 0.9)', color: '#616161' }}>
                      👤 ارجاع به: {report.assignedTo.name}
                    </span>
                  )}
                </div>
                
                <p style={{ fontSize: '12px', color: '#9e9e9e' }}>
                  🕐 {new Date(report.createdAt).toLocaleDateString('fa-IR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            {user?.role === 'admin' && report.status === 'new' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(224, 224, 224, 0.5)' }}>
                <button 
                  onClick={() => updateStatus(report.id, 'approved')}
                  className="success"
                  style={{ fontSize: '13px', padding: '0.625rem 1rem', width: '100%' }}
                >
                  ✅ تایید
                </button>
                <button 
                  onClick={() => setShowAssignModal(report.id)}
                  className="warning"
                  style={{ fontSize: '13px', padding: '0.625rem 1rem', width: '100%' }}
                >
                  📬 تایید و ارجاع
                </button>
                <button 
                  onClick={() => updateStatus(report.id, 'rejected')}
                  className="danger"
                  style={{ fontSize: '13px', padding: '0.625rem 1rem', width: '100%' }}
                >
                  ❌ رد
                </button>
              </div>
            )}

            {showAssignModal === report.id && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                background: 'rgba(227, 242, 253, 0.5)', 
                borderRadius: '12px',
                backdropFilter: 'blur(10px)'
              }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '14px' }}>ارجاع به کاربر:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <select 
                    value={selectedUserId} 
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="">انتخاب کاربر</option>
                    {users.map((u: any) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.username})</option>
                    ))}
                  </select>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => assignReport(report.id)}
                      disabled={!selectedUserId}
                      className="success"
                      style={{ fontSize: '13px', flex: 1 }}
                    >
                      ارجاع
                    </button>
                    <button 
                      onClick={() => setShowAssignModal(null)}
                      className="secondary"
                      style={{ fontSize: '13px', flex: 1 }}
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
