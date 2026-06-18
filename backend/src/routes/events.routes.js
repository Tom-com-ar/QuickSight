import { Router } from 'express';
import { sendEvent } from '../controllers/eventController.js';

const router = Router();

router.post('/', sendEvent);

export default router;