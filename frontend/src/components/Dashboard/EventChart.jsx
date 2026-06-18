import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default function EventChart({ history }) {
  const ref      = useRef();
  const chartRef = useRef();

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(ref.current, {
      type: 'line',
      data: {
        labels: history.map((_, i) => i),
        datasets: [{
          label: 'Eventos/s',
          data: history,
          borderColor: '#4ade80',
          backgroundColor: 'rgba(74,222,128,0.1)',
          fill: true,
          tension: 0.4,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: 'white' } } },
        scales: {
          y: { beginAtZero: true, ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
          x: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [history]);

  return (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 20, border: '1px solid #333' }}>
      <h3 style={{ margin: '0 0 16px', color: '#4ade80' }}>Historial de Eventos en Tiempo Real</h3>
      <canvas ref={ref} height={100} />
    </div>
  );
}