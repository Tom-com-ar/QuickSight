import { Router } from 'express';
import { getMetrics, getHistory } from '../controllers/analyticsController.js';

const router = Router();

router.get('/metrics', getMetrics);
router.get('/history', getHistory);

export default router;