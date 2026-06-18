import { useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function EventSimulator() {
  const [status,  setStatus]  = useState('');
  const [loading, setLoading] = useState(false);

  const sendBulk = async (count, type = 'log') => {
    setLoading(true);
    setStatus(`Enviando ${count} eventos...`);
    try {
      const r = await fetch(`${API}/api/events/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-level': 'admin' },
        body: JSON.stringify({ count, type }),
      });
      const d = await r.json();
      setStatus(`✅ ${d.queued} eventos encolados`);
    } catch {
      setStatus('❌ Error al enviar');
    }
    setLoading(false);
  };

  const ddos = async () => {
    setLoading(true);
    setStatus('Simulando ataque DDoS...');
    try {
      const r = await fetch(`${API}/api/events/ddos`, { method: 'POST' });
      const d = await r.json();
      setStatus(`🛡️ ${d.message}`);
    } catch {
      setStatus('❌ Error en simulación');
    }
    setLoading(false);
  };

  const buttons = [
    { label: '📦 100 eventos',    action: () => sendBulk(100),   color: '#4ade80' },
    { label: '🚀 1,000 eventos',  action: () => sendBulk(1000),  color: '#60a5fa' },
    { label: '💥 10,000 eventos', action: () => sendBulk(10000), color: '#fbbf24' },
    { label: '🔴 Simular DDoS',   action: ddos,                  color: '#f87171' },
  ];

  return (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 20, border: '1px solid #333' }}>
      <h3 style={{ margin: '0 0 16px', color: '#4ade80' }}>Simulador</h3>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        {buttons.map(b => (
          <button
            key={b.label}
            onClick={b.action}
            disabled={loading}
            style={{
              background: b.color,
              color: '#0f0f1a',
              border: 'none',
              borderRadius: 8,
              padding: '10px 16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              opacity: loading ? 0.6 : 1,
              fontSize: 13,
            }}
          >
            {b.label}
          </button>
        ))}
      </div>
      {status && <div style={{ color: '#fbbf24', fontSize: 13 }}>{status}</div>}
    </div>
  );
}