import { useMetrics } from '../hooks/useMetrics.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default function Analytics() {
  const data = useMetrics();

  const byTypeChart = {
    labels: Object.keys(data?.byType || {}),
    datasets: [{
      data: Object.values(data?.byType || {}),
      backgroundColor: ['#4ade80', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa'],
    }],
  };

  const byHourChart = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
    datasets: [{
      label: 'Eventos',
      data: Array.from({ length: 24 }, (_, i) => data?.byHour?.[i] ?? 0),
      backgroundColor: '#4ade80',
    }],
  };

  const chartOpts = (title) => ({
    plugins: {
      legend: { labels: { color: 'white' } },
      title:  { display: true, text: title, color: '#4ade80' },
    },
    scales: {
      y: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      x: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
    },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Total procesados', value: data?.total  ?? 0, color: '#4ade80' },
          { label: 'Errores',          value: data?.errors ?? 0, color: '#f87171' },
          { label: 'Bloqueados',       value: data?.blocks ?? 0, color: '#fbbf24' },
        ].map(c => (
          <div key={c.label} style={{ background: '#1a1a2e', borderRadius: 12, padding: 20, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#aaa' }}>{c.label}</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 20, border: '1px solid #333' }}>
          <Doughnut data={byTypeChart} options={{ plugins: { legend: { labels: { color: 'white' } } } }} />
        </div>
        <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 20, border: '1px solid #333' }}>
          <Bar data={byHourChart} options={chartOpts('Eventos por hora')} />
        </div>
      </div>
    </div>
  );
}