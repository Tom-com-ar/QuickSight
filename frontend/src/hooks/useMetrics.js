import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useMetrics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch_ = () =>
      fetch(`${API}/api/analytics/metrics`)
        .then(r => r.json())
        .then(setData)
        .catch(console.error);

    fetch_();
    const id = setInterval(fetch_, 5000);
    return () => clearInterval(id);
  }, []);

  return data;
}