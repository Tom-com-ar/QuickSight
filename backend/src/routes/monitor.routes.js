import { Router } from 'express';
import { getQueueStatus, healthCheck } from '../controllers/monitorController.js';

const router = Router();

router.get('/queue-status', getQueueStatus);
router.get('/health',       healthCheck);

export default router;