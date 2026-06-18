import { useState, useEffect } from 'react';

const API   = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TYPES = ['', 'alert', 'log', 'metric', 'security', 'error'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [page,   setPage]   = useState(0);
  const [total,  setTotal]  = useState(0);
  const [type,   setType]   = useState('');
  const [form,   setForm]   = useState({ type: 'log', priority: 'normal' });
  const [msg,    setMsg]    = useState('');

  const load = () =>
    fetch(`${API}/api/analytics/history?page=${page}&limit=20${type ? `&type=${type}` : ''}`)
      .then(r => r.json())
      .then(d => { setEvents(d.events || []); setTotal(d.total || 0); });

  useEffect(() => { load(); }, [page, type]);

  const submit = async () => {
    try {
      const r = await fetch(`${API}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id':    'user-1',
          'x-user-level': 'basic',
        },
        body: JSON.stringify({ type: form.type, data: {}, priority: form.priority }),
      });
      const d = await r.json();
      setMsg(d.success ? `✅ Job ${d.jobId} encolado en cola ${d.queue}` : `❌ ${d.error}`);
      setTimeout(load, 500);
    } catch (e) {
      setMsg('❌ ' + e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Formulario */}
      <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 20, border: '1px solid #333' }}>
        <h3 style={{ margin: '0 0 16px', color: '#4ade80' }}>Enviar Evento</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, color: '#aaa', marginBottom: 4 }}>Tipo</div>
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              style={{ background: '#0f0f1a', color: 'white', border: '1px solid #333', borderRadius: 6, padding: '8px 12px' }}
            >
              {TYPES.filter(Boolean).map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#aaa', marginBottom: 4 }}>Prioridad</div>
            <select
              value={form.priority}
              onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              style={{ background: '#0f0f1a', color: 'white', border: '1px solid #333', borderRadius: 6, padding: '8px 12px' }}
            >
              <option value="normal">Normal</option>
              <option value="high">Alta prioridad</option>
            </select>
          </div>
          <button
            onClick={submit}
            style={{ background: '#4ade80', color: '#0f0f1a', border: 'none', borderRadius: 6, padding: '9px 20px', fontWeight: 700, cursor: 'pointer' }}
          >
            Enviar
          </button>
        </div>
        {msg && <div style={{ marginTop: 10, color: '#fbbf24', fontSize: 13 }}>{msg}</div>}
      </div>

      {/* Historial */}
      <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 20, border: '1px solid #333' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: '#4ade80' }}>Historial ({total})</h3>
          <select
            value={type}
            onChange={e => { setType(e.target.value); setPage(0); }}
            style={{ background: '#0f0f1a', color: 'white', border: '1px solid #333', borderRadius: 6, padding: '6px 10px' }}
          >
            {TYPES.map(t => <option key={t} value={t}>{t || 'Todos'}</option>)}
          </select>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ color: '#aaa', borderBottom: '1px solid #333' }}>
              {['ID', 'Tipo', 'Estado', 'Latencia', 'Hora'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '6px 8px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid #1e1e3a' }}>
                <td style={{ padding: '8px', color: '#555', fontSize: 11 }}>{String(e.id).slice(0, 8)}</td>
                <td style={{ padding: '8px', color: '#60a5fa' }}>{e.type}</td>
                <td style={{ padding: '8px', color: '#4ade80' }}>{e.status}</td>
                <td style={{ padding: '8px' }}>{e.latency}ms</td>
                <td style={{ padding: '8px', color: '#aaa' }}>{new Date(e.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{ background: '#333', color: 'white', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer' }}
          >◀</button>
          <span style={{ color: '#aaa', fontSize: 13 }}>Página {page + 1}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * 20 >= total}
            style={{ background: '#333', color: 'white', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer' }}
          >▶</button>
        </div>
      </div>
    </div>
  );
}