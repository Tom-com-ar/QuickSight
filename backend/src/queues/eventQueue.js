import { Queue } from 'bullmq';
import { connection, defaultJobOptions } from '../config/bull.js';

export const eventQueue = new Queue('events', {
  connection,
  defaultJobOptions,
});

export const priorityQueue = new Queue('priority-events', {
  connection,
  defaultJobOptions,
});