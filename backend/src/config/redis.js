import 'dotenv/config';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: {
    rejectUnauthorized: false
  }
});

redis.on("connect", () => {
  console.log("🟢 Redis Upstash conectado");
});

redis.on("error", (err) => {
  console.error("🔴 Error Redis:", err);
});

export default redis;