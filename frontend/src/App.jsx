import { useState } from 'react';
import Dashboard from './pages/Dashboard.jsx';
import Events from './pages/Events.jsx';
import Analytics from './pages/Analytics.jsx';

export default function App() {
  const [page, setPage] = useState('dashboard');

  const nav = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'events',    label: 'Eventos' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
        <div style={{ background: '#0f0f1a', color: 'white', fontFamily: 'system-ui' }}>
        <nav style={{ background: '#1a1a2e', padding: '12px 24px', display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 20, color: '#4ade80', marginRight: 24 }}>QuickSight</span>
            {nav.map(n => (
            <button
                key={n.id}
                onClick={() => setPage(n.id)}
                style={{
                background: page === n.id ? '#4ade80' : 'transparent',
                color: page === n.id ? '#0f0f1a' : 'white',
                border: '1px solid #4ade80',
                borderRadius: 6,
                padding: '6px 16px',
                cursor: 'pointer',
                fontWeight: 600,
                }}
            >
                {n.label}
            </button>
            ))}
        </nav>
        <div style={{ padding: 24 }}>
            {page === 'dashboard'  && <Dashboard />}
            {page === 'events'     && <Events />}
            {page === 'analytics'  && <Analytics />}
        </div>
        </div>
  );
}