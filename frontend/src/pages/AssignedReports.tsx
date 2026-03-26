import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { IconChevron, IconInbox } from '../components/Icons';

export default function AssignedReports() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { fetchReports(); }, []);
  const fetchReports = async () => { try { setReports((await api.get('/reports/assigned')).data); } catch (e) { console.error(e); } };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">خبرهای ارجاع شده</h1>
        <button onClick={() => navigate(-1)} className="ghost" style={{ padding: '0.375rem' }}><IconChevron /></button>
      </div>

      {reports.length === 0 ? (
        <div className="card empty-state">
          <div style={{ color: 'var(--text-tertiary)' }}><IconInbox /></div>
          <p style={{ marginTop: 8 }}>خبری ارجاع نشده</p>
        </div>
      ) : reports.map((r: any) => {
        const data = typeof r.data === 'string' ? JSON.parse(r.data || '{}') : r.data || {};
        return (
          <div key={r.id} className="card">
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{r.form?.title}</div>
            <div style={{ background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', padding: '0.625rem', marginBottom: 8 }}>
              {Object.entries(data).map(([k, v]: any) => (
                <p key={k} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}><span style={{ fontWeight: 500 }}>{k}:</span> {v}</p>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 4, fontSize: 11 }}>
              <span className="badge badge-assigned">ارجاع شده</span>
              {r.category && <span className="badge badge-neutral">{r.category.name}</span>}
              {r.user && <span className="badge badge-neutral">{r.user.name}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
