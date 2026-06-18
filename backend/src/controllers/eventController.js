import redis from '../config/redis.js';

const VALID_TYPES = ['alert', 'log', 'metric', 'security', 'error'];
const VALID_PRIORITIES = ['low', 'normal', 'high'];

export const sendEvent = async (req, res) => {
  try {
    const { type, data, priority = 'normal' } = req.body;

    if (!type)
      return res.status(400).json({ error: 'type es requerido' });
    if (!VALID_TYPES.includes(type))
      return res.status(400).json({ error: `type debe ser: ${VALID_TYPES.join(', ')}` });

    const event = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type,
      data: data || {},
      priority,
      userId: req.headers['x-user-id'] || req.ip,
      status: 'queued',
      timestamp: Date.now(),
    };

    await redis.lpush('events:history', JSON.stringify(event));
    await redis.ltrim('events:history', 0, 999);

    res.status(202).json({ success: true, jobId: event.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};