export default function QueueStatus({ queues }) {
  const rows = [
    { name: 'Normal',      q: queues?.normal },
    { name: 'Prioritaria', q: queues?.priority },
  ];

  return (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 20, border: '1px solid #333' }}>
      <h3 style={{ margin: '0 0 16px', color: '#4ade80' }}>Estado de Colas</h3>
      {rows.map(({ name, q }) => (
        <div key={name} style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>{name}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, fontSize: 13 }}>
            {[
              { label: 'Esperando', value: q?.waiting    ?? 0, color: '#fbbf24' },
              { label: 'Activos',   value: q?.active     ?? 0, color: '#4ade80' },
              { label: 'Completos', value: q?.completed  ?? 0, color: '#60a5fa' },
              { label: 'Fallidos',  value: q?.failed     ?? 0, color: '#f87171' },
            ].map(s => (
              <div key={s.label} style={{ background: '#0f0f1a', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                <div style={{ color: s.color, fontWeight: 700, fontSize: 20 }}>{s.value}</div>
                <div style={{ color: '#aaa', fontSize: 11, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}