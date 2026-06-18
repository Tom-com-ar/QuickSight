import { Queue, Worker } from 'bullmq';
import redis from './redis.js';

const eventQueue = new Queue("events", {
  connection: redis,
});

const priorityQueue = new Queue("priority-events", {
  connection: redis,
});

export { eventQueue, priorityQueue };
