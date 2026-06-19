import redis from '../../config/redis.js';
import { eventQueue, priorityQueue } from '../eventQueue.js';

export let io = null;
export const setAlertIO = (socketIO) => { io = socketIO; };

setInterval(async () => {
  const [normalC, priorityC] = await Promise.all([
    eventQueue.getJobCounts(),
    priorityQueue.getJobCounts(),
  ]);

  const totalWaiting = (normalC.waiting || 0) + (priorityC.waiting || 0);
  const blocks = parseInt(await redis.get('stats:blocks') || '0');

  if (totalWaiting > 1000 && io) {
    io.emit('alert', {
      type: 'QUEUE_OVERFLOW',
      message: `⚠️ Cola con ${totalWaiting} eventos pendientes`,
      timestamp: Date.now(),
    });
  }

  if (blocks > 100 && io) {
    io.emit('alert', {
      type: 'RATE_LIMIT_SURGE',
      message: `🚨 Rate limiting bloqueó ${blocks} requests`,
      timestamp: Date.now(),
    });
  }
}, 2000);