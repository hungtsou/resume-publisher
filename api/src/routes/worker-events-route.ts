import { Router } from 'express';
import { getWorkerEvents, postWorkerEvent } from '../controllers/worker-events-controller.ts';

const router = Router();

router.get('/', getWorkerEvents);
router.post('/', postWorkerEvent);

export { router as workerEventsRoute };
