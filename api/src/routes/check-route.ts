import { Router } from 'express';
import { getCheck } from '../controllers/check-controller.ts';

const router = Router();

router.get('/', getCheck);

export { router as checkRoute };
