import { Router } from 'express';
import { getWorkerEvents } from '../controllers/worker-events-controller.ts';

const router = Router();

router.get('/', getWorkerEvents);

export { router as workerEventsRoute };
