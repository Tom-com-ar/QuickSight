import { Worker } from 'bullmq';
import { connection } from '../../config/bull.js';
import redis from '../../config/redis.js';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export let io = null;
export const setIO = (socketIO) => { io = socketIO; };

const processEvent = async (job) => {
  const start = Date.now();
  const { type, data, userId } = job.data;

  await sleep(Math.random() * 100 + 50); // simular trabajo

  const latency = Date.now() - start;

  const record = JSON.stringify({
    id: job.id,
    type,
    userId,
    data,
    status: 'completed',
    latency,
    timestamp: Date.now(),
  });

  // Guardar historial + métricas
  await redis.lpush('events:history', record);
  await redis.ltrim('events:history', 0, 999);
  await redis.incr('stats:total');
  await redis.incr(`stats:type:${type}`);
  await redis.lpush('stats:latencies', latency);
  await redis.ltrim('stats:latencies', 0, 99);

  const hourKey = `stats:hour:${new Date().getHours()}`;
  await redis.incr(hourKey);
  await redis.expire(hourKey, 86400);

  if (io) io.emit('new-event', { type, userId, status: 'healthy', timestamp: Date.now() });

  return { success: true, latency };
};

export const eventWorker   = new Worker('events',          processEvent, { connection });
export const priorityWorker = new Worker('priority-events', processEvent, { connection });

eventWorker.on('failed', async (job, err) => {
  await redis.incr('stats:errors');
  console.error(`❌ Job ${job?.id} falló:`, err.message);
});

console.log('👷 Workers iniciados');