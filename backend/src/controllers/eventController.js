import { eventQueue, priorityQueue } from '../queues/eventQueue.js';

const VALID_TYPES = ['alert', 'log', 'metric', 'security', 'error'];

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