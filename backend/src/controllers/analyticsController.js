import redis from '../config/redis.js';

export const getMetrics = async (req, res) => {
  const [total, errors, blocks] = await Promise.all([
    redis.get('stats:total'),
    redis.get('stats:errors'),
    redis.get('stats:blocks'),
  ]);

  const lats = await redis.lrange('stats:latencies', 0, -1);
  const avgLatency = lats.length
    ? Math.round(lats.reduce((a, b) => a + parseInt(b), 0) / lats.length)
    : 0;

  const byType = {};
  for (const t of ['alert', 'log', 'metric', 'security', 'error']) {
    byType[t] = parseInt(await redis.get(`stats:type:${t}`) || '0');
  }

  const byHour = {};
  for (let h = 0; h < 24; h++) {
    byHour[h] = parseInt(await redis.get(`stats:hour:${h}`) || '0');
  }

  res.json({
    total:      parseInt(total  || '0'),
    errors:     parseInt(errors || '0'),
    blocks:     parseInt(blocks || '0'),
    avgLatency,
    byType,
    byHour,
  });
};

export const getHistory = async (req, res) => {
  const page  = parseInt(req.query.page  || '0');
  const limit = parseInt(req.query.limit || '20');
  const start = page * limit;
  const end   = start + limit - 1;

  const raw   = await redis.lrange('events:history', start, end);
  const total = await redis.llen('events:history');
  let events  = raw.map(r => JSON.parse(r));

  if (req.query.type) {
    events = events.filter(e => e.type === req.query.type);
  }

  res.json({ events, total, page, limit });
};