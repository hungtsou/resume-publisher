import { Router } from 'express';
import { sendResume } from '../controllers/resume-controller.ts';

const router = Router();

router.post('/', sendResume);

export { router as resumeRoute };