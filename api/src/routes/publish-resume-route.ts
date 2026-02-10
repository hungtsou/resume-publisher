import { Router } from 'express';
import { publishResume } from '../controllers/publish-resume-controller.ts';

const router = Router();

router.post('/', publishResume);

export { router as publishResumeRoute };