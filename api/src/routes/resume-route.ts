import { Router } from 'express';
import { sendResume } from '../controllers/resume-controller';

const router = Router();

router.post('/', sendResume);

export { router as resumeRoute };