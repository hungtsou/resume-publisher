import { Router } from 'express';
import { createResumeController, getResumeController, getResumesController } from '../controllers/resume-controller.ts';

const router = Router();

router.post('/', createResumeController);
router.get('/:id', getResumeController);
router.get('/', getResumesController);

export { router as resumeRoute };