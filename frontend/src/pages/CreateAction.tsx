import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function CreateAction() {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
    fetchUsers();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data.filter((r: any) => r.status === 'needs_action'));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/actions', {
        title,
        description,
        assignedToId,
        reportIds: selectedReports
      });
      alert('✅ اقدام با موفقیت ایجاد شد');
      navigate('/actions');
    } catch (error) {
      alert('❌ خطا در ایجاد اقدام');
      console.error(error);
    }
  };

  const toggleReport = (reportId: string) => {
    if (selectedReports.includes(reportId)) {
      setSelectedReports(selectedReports.filter(id => id !== reportId));
    } else {
      setSelectedReports([...selectedReports, reportId]);
    }
  };

  return (
    <div className="container">
      <div className="page-header" style={{ flexDirection: 'row', gap: '0.75rem', alignItems: 'center' }}>
        <h1 className="page-title" style={{ flex: 1, fontSize: '18px' }}>➕ ایجاد اقدام</h1>
        <button onClick={() => navigate('/actions')} className="secondary" style={{ fontSize: '13px', padding: '0.5rem 1rem' }}>
          🔙
        </button>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label>عنوان اقدام</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: بررسی و رفع مشکل سرور"
              required
            />
          </div>

          <div className="field-group">
            <label>توضیحات کامل</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="شرح کامل اقدام مورد نیاز..."
              required
              rows={4}
            />
          </div>

          <div className="field-group">
            <label>مسئول انجام</label>
            <select value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)} required>
              <option value="">👤 انتخاب مسئول</option>
              {users.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.phone} - {user.role === 'admin' ? 'مدیر' : user.role === 'operator' ? 'کارشناس' : 'کاربر'}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label>خبرهای مرتبط ({selectedReports.length} انتخاب شده)</label>
            <div style={{ 
              maxHeight: '250px', 
              overflow: 'auto', 
              border: '1px solid rgba(224, 224, 224, 0.5)', 
              padding: '0.75rem', 
              borderRadius: '8px',
              background: 'rgba(250, 250, 250, 0.8)'
            }}>
              {reports.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#757575', padding: '1rem', fontSize: '13px' }}>
                  هیچ خبر نیازمند اقدامی وجود ندارد
                </p>
              ) : (
                reports.map((report: any) => (
                  <div key={report.id} style={{ 
                    marginBottom: '0.75rem',
                    padding: '0.75rem',
                    background: 'white',
                    borderRadius: '8px',
                    border: selectedReports.includes(report.id) ? '2px solid #1976d2' : '1px solid rgba(224, 224, 224, 0.5)'
                  }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={() => toggleReport(report.id)}
                        style={{ marginLeft: '0.75rem', width: 'auto', marginTop: '0.25rem' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, color: '#212121', marginBottom: '0.25rem', fontSize: '14px' }}>
                          {report.form?.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#757575' }}>
                          📁 {report.category?.name} • 🕐 {new Date(report.createdAt).toLocaleDateString('fa-IR')}
                        </div>
                      </div>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="submit" className="success" style={{ width: '100%' }}>
              ✅ ایجاد اقدام
            </button>
            <button type="button" onClick={() => navigate('/actions')} className="secondary" style={{ width: '100%' }}>
              ❌ انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
