import { Router } from 'express';
import { sendEvent, sendBulkEvents, simulateDDoS } from '../controllers/eventController.js';
import { rateLimiter } from '../middlewares/rateLimiter.js';
import { userLevel } from '../middlewares/auth.js';

const router = Router();

router.use(userLevel);

router.post('/',     (req, res, next) => rateLimiter(req.userLevel)(req, res, next), sendEvent);
router.post('/bulk', rateLimiter('premium'), sendBulkEvents);
router.post('/ddos', simulateDDoS);

export default router;