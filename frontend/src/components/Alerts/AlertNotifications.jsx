export default function AlertNotifications({ alerts }) {
  if (!alerts.length) return null;

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000, maxWidth: 340 }}>
      {alerts.map((a, i) => (
        <div key={i} style={{
          background: a.type === 'QUEUE_OVERFLOW' ? '#92400e' : '#7f1d1d',
          border: `1px solid ${a.type === 'QUEUE_OVERFLOW' ? '#fbbf24' : '#f87171'}`,
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 8,
          fontSize: 14,
        }}>
          {a.message}
        </div>
      ))}
    </div>
  );
}