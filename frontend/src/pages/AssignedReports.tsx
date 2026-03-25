import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function AssignedReports() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports/assigned');
      setReports(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <div className="page-header" style={{ flexDirection: 'row', gap: '0.75rem', alignItems: 'center' }}>
        <h1 className="page-title" style={{ flex: 1, fontSize: '18px' }}>📬 خبرهای ارجاع شده</h1>
        <button onClick={() => navigate('/')} className="secondary" style={{ fontSize: '13px', padding: '0.5rem 1rem' }}>
          🏠
        </button>
      </div>
      
      {reports.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📭</div>
          <p style={{ color: '#757575', fontSize: '14px' }}>هیچ خبری به شما ارجاع نشده است</p>
        </div>
      ) : (
        reports.map((report: any) => (
          <div key={report.id} className="card">
            <h3 style={{ marginBottom: '0.75rem', color: '#212121', fontSize: '15px' }}>{report.form?.title}</h3>
            <div style={{ marginBottom: '1rem' }}>
              {Object.entries(typeof report.data === 'string' ? JSON.parse(report.data || '{}') : report.data || {}).map(([key, value]: any) => (
                <p key={key} style={{ fontSize: '13px', color: '#616161', marginBottom: '0.5rem' }}>
                  <strong>{key}:</strong> {value}
                </p>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-assigned">
                📬 ارجاع شده
              </span>
              <span className="badge" style={{ background: 'rgba(245, 245, 245, 0.9)', color: '#616161' }}>
                📁 {report.category?.name}
              </span>
              <span className="badge" style={{ background: 'rgba(245, 245, 245, 0.9)', color: '#616161' }}>
                👤 {report.user?.name}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
