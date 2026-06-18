import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import redis from './src/config/redis.js';
import { eventQueue, priorityQueue } from './src/queues/eventQueue.js';
import { setIO } from './src/queues/workers/eventWorker.js';
import eventsRoutes from './src/routes/events.routes.js';
import analyticsRoutes from './src/routes/analytics.routes.js';
import monitorRoutes from './src/routes/monitor.routes.js';

// Iniciar workers
import './src/queues/workers/eventWorker.js';

const app = express();
const httpServer = createServer(app);

// Socket.io
const io = new Server(httpServer, { cors: { origin: '*' } });
setIO(io);

app.use(cors());
app.use(express.json());

app.use('/api/events',    eventsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/monitor',   monitorRoutes);

app.get('/ping', (req, res) => res.json({ ok: true }));

// Emitir métricas cada segundo al dashboard
setInterval(async () => {
  const secKey = `stats:sec:${Math.floor(Date.now() / 1000) - 1}`;
  const [total, errors, blocks, eps, normalC, priorityC] = await Promise.all([
    redis.get('stats:total'),
    redis.get('stats:errors'),
    redis.get('stats:blocks'),
    redis.get(secKey),
    eventQueue.getJobCounts(),
    priorityQueue.getJobCounts(),
  ]);

  const lats = await redis.lrange('stats:latencies', 0, -1);
  const avgLatency = lats.length
    ? Math.round(lats.reduce((a, b) => a + parseInt(b), 0) / lats.length)
    : 0;

  io.emit('metrics', {
    eventsPerSecond: parseInt(eps    || '0'),
    total:           parseInt(total  || '0'),
    errors:          parseInt(errors || '0'),
    blocks:          parseInt(blocks || '0'),
    avgLatency,
    queueLength: (normalC.waiting || 0) + (priorityC.waiting || 0),
    queues: { normal: normalC, priority: priorityC },
  });
}, 1000);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`🚀 Puerto ${PORT}`));