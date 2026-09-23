import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import api from '../../lib/axios.js';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/admin/audit-logs')
      .then(({ data }) => {
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data?.logs) ? data.logs : Array.isArray(data) ? data : [];
        setLogs(list);
      })
      .catch((err) => { console.error(err); setLogs([]); })
      .finally(() => setLoading(false));
  }, []);
  const formatDate = (d) => d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';
  return (
    <div style={{ padding: '16px' }}>
      <p style={{ color: '#475569', fontSize: '12px', margin: '0 0 12px' }}>{(Array.isArray(logs) ? logs : []).length} log entries</p>
      {loading ? [1,2,3,4].map(i => <div key={i} style={{ height: '65px', background: '#1a1a2e', borderRadius: '12px', marginBottom: '8px' }} />)
       : !Array.isArray(logs) || logs.length === 0 ? <p style={{ color: '#64748b', textAlign: 'center', padding: '40px 0' }}>No logs yet</p>
       : (Array.isArray(logs) ? logs : []).map((log, i) => (
        <div key={i} style={{ background: '#1a1a2e', borderRadius: '12px', padding: '12px 14px', marginBottom: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
            <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600 }}>{log.action}</span>
            <span style={{ color: '#374151', fontSize: '10px' }}>{formatDate(log.createdAt)}</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 2px' }}>{log.actorName} ({log.actorRole}) → {log.targetType}</p>
          {log.ipAddress && <p style={{ color: '#374151', fontSize: '10px', margin: 0, fontFamily: 'monospace' }}>{log.ipAddress}</p>}
        </div>
      ))}
    </div>
  );
}
