import redis from '../config/redis.js';
import { eventQueue, priorityQueue } from '../queues/eventQueue.js';

export const getQueueStatus = async (req, res) => {
  const [normalC, priorityC] = await Promise.all([
    eventQueue.getJobCounts(),
    priorityQueue.getJobCounts(),
  ]);

  const secKey = `stats:sec:${Math.floor(Date.now() / 1000) - 1}`;
  const eps = parseInt(await redis.get(secKey) || '0');

  res.json({
    queues: { normal: normalC, priority: priorityC },
    eventsPerSecond: eps,
  });
};

export const healthCheck = async (req, res) => {
  try {
    await redis.ping();
    const [normalC, priorityC] = await Promise.all([
      eventQueue.getJobCounts(),
      priorityQueue.getJobCounts(),
    ]);

    res.json({
      status: 'healthy',
      redis: 'connected',
      workers: { events: 'running', priority: 'running' },
      queues: { normal: normalC, priority: priorityC },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({ status: 'unhealthy', error: err.message });
  }
};