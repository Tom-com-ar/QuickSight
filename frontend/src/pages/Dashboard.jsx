import { useState, useRef } from 'react';
import { useWebSocket } from '../hooks/useWebSocket.js';
import MetricsGrid from '../components/Dashboard/MetricsGrid.jsx';
import EventChart from '../components/Dashboard/EventChart.jsx';
import QueueStatus from '../components/Dashboard/QueueStatus.jsx';
import EventSimulator from '../components/EventSimulator/EventSimulator.jsx';
import AlertNotifications from '../components/Alerts/AlertNotifications.jsx';

export default function Dashboard() {
  const { metrics, events, alerts } = useWebSocket();
  const [history, setHistory] = useState([]);
  const lastEps = useRef(null);

  // Acumular historial para el gráfico
  if (metrics && metrics.eventsPerSecond !== lastEps.current) {
    lastEps.current = metrics.eventsPerSecond;
    setHistory(prev => [...prev.slice(-29), metrics.eventsPerSecond ?? 0]);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AlertNotifications alerts={alerts} />

      <MetricsGrid metrics={metrics} />

      <EventChart history={history} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <QueueStatus queues={metrics?.queues} />
        <EventSimulator />
      </div>

      {/* Eventos en vivo */}
      <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 20, border: '1px solid #333' }}>
        <h3 style={{ margin: '0 0 12px', color: '#4ade80' }}>Eventos en vivo</h3>
        <div style={{ maxHeight: 200, overflowY: 'auto' }}>
          {events.length === 0 && (
            <div style={{ color: '#555', fontSize: 13 }}>Esperando eventos...</div>
          )}
          {events.map((e, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: '1px solid #222',
              fontSize: 13,
            }}>
              <span style={{ color: '#60a5fa', width: 80 }}>{e.type}</span>
              <span style={{ color: '#aaa' }}>{new Date(e.timestamp).toLocaleTimeString()}</span>
              <span style={{ color: '#4ade80', fontSize: 11, background: '#052e16', padding: '2px 8px', borderRadius: 99 }}>
                {e.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}