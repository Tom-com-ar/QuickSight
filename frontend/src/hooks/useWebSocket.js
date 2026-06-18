import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useWebSocket() {
  const [metrics, setMetrics]   = useState(null);
  const [events,  setEvents]    = useState([]);
  const [alerts,  setAlerts]    = useState([]);

  useEffect(() => {
    const socket = io(API);
    socket.on('metrics',   setMetrics);
    socket.on('new-event', (e) => setEvents(prev => [e, ...prev].slice(0, 50)));
    socket.on('alert',     (a) => setAlerts(prev => [a, ...prev].slice(0, 5)));
    return () => socket.disconnect();
  }, []);

  return { metrics, events, alerts };
}