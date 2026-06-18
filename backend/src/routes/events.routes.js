import { Router } from 'express';
import { sendEvent } from '../controllers/eventController.js';
import { rateLimiter } from '../middlewares/rateLimiter.js';
import { userLevel } from '../middlewares/auth.js';

const router = Router();

router.use(userLevel);

// El nivel se toma del header x-user-level
router.post('/', (req, res, next) => rateLimiter(req.userLevel)(req, res, next), sendEvent);

export default router;