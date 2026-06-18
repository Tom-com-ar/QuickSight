import { eventQueue, priorityQueue } from '../queues/eventQueue.js';
import redis from '../config/redis.js';

const VALID_TYPES = ['alert', 'log', 'metric', 'security', 'error'];

// R1 - Envío individual
export const sendEvent = async (req, res) => {
  try {
    const { type, data, priority = 'normal' } = req.body;

    if (!type)
      return res.status(400).json({ error: 'type es requerido' });
    if (!VALID_TYPES.includes(type))
      return res.status(400).json({ error: `type debe ser: ${VALID_TYPES.join(', ')}` });

    const jobData = {
      type,
      data: data || {},
      priority,
      userId: req.headers['x-user-id'] || req.ip,
      timestamp: Date.now(),
    };

    const useHighPriority = priority === 'high' || type === 'security';
    const queue = useHighPriority ? priorityQueue : eventQueue;
    const job = await queue.add('process-event', jobData, {
      priority: useHighPriority ? 1 : 10,
    });

    res.status(202).json({
      success: true,
      jobId: job.id,
      queue: useHighPriority ? 'priority' : 'normal',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// R5 - Simulador masivo
export const sendBulkEvents = async (req, res) => {
  try {
    const { count = 100, type = 'log' } = req.body;
    const total = Math.min(count, 10000);

    const jobs = Array.from({ length: total }, (_, i) => ({
      name: 'process-event',
      data: {
        type,
        data: { index: i, bulk: true },
        userId: req.headers['x-user-id'] || 'simulator',
        priority: 'normal',
        timestamp: Date.now(),
      },
    }));

    await eventQueue.addBulk(jobs);

    const secKey = `stats:sec:${Math.floor(Date.now() / 1000)}`;
    await redis.incrby(secKey, total);
    await redis.expire(secKey, 10);

    res.json({ success: true, queued: total, type });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// R6 - Simulación DDoS
export const simulateDDoS = async (req, res) => {
  const results = { blocked: 0, allowed: 0 };
  const total = 200;

  for (let i = 0; i < total; i++) {
    const key = `rate:basic:ddos-attacker`;
    const now = Date.now();

    await redis.zremrangebyscore(key, 0, now - 60000);
    const count = await redis.zcard(key);

    if (count >= 100) {
      results.blocked++;
      await redis.incr('stats:blocks');
    } else {
      results.allowed++;
      await redis.zadd(key, now, `${now}-${i}`);
    }
  }

  res.json({
    success: true,
    simulation: results,
    total,
    message: `Rate limiting bloqueó ${results.blocked}/${total} requests del atacante`,
  });
};