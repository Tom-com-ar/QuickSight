import redis from '../config/redis.js';

const LIMITS = {
  basic:   { max: 100,      window: 60000 },
  premium: { max: 1000,     window: 60000 },
  admin:   { max: Infinity, window: 60000 },
};

export const rateLimiter = (level = 'basic') => async (req, res, next) => {
  const limit = LIMITS[level];
  if (limit.max === Infinity) return next();

  const userId = req.userId || req.ip;
  const key = `rate:${level}:${userId}`;
  const now = Date.now();

  await redis.zremrangebyscore(key, 0, now - limit.window);
  const count = await redis.zcard(key);

  // Headers informativos
  res.setHeader('X-RateLimit-Limit',     limit.max);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, limit.max - count));
  res.setHeader('X-RateLimit-Reset',     new Date(now + limit.window).toISOString());

  if (count >= limit.max) {
    await redis.incr('stats:blocks');
    return res.status(429).json({
      error: 'Rate limit exceeded',
      level,
      limit: limit.max,
      current: count,
      retryAfter: '60s',
    });
  }

  await redis.zadd(key, now, `${now}-${Math.random()}`);
  await redis.expire(key, limit.window / 1000);
  next();
};