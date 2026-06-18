import redis from './redis.js';

export const connection = redis;
export const defaultJobOptions = {
  removeOnComplete: true,
  removeOnFail: false,
};
