export default function MetricsGrid({ metrics }) {
  const cards = [
    { label: 'Eventos/seg',    value: metrics?.eventsPerSecond ?? 0,   color: '#4ade80' },
    { label: 'Cola pendiente', value: metrics?.queueLength ?? 0,        color: '#fbbf24' },
    { label: 'Bloqueados',     value: metrics?.blocks ?? 0,             color: '#f87171' },
    { label: 'Latencia media', value: `${metrics?.avgLatency ?? 0}ms`,  color: '#60a5fa' },
    { label: 'Total eventos',  value: metrics?.total ?? 0,              color: '#a78bfa' },
    { label: 'Errores',        value: metrics?.errors ?? 0,             color: '#fb923c' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
      {cards.map(c => (
        <div key={c.label} style={{ background: '#1a1a2e', borderRadius: 12, padding: 20, border: '1px solid #333' }}>
          <div style={{ fontSize: 12, color: '#aaa', marginBottom: 8 }}>{c.label}</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: c.color }}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}