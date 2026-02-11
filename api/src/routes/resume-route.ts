import { Router } from 'express';
import { createResumeController, getResumeController, getResumesController, updateResumeController } from '../controllers/resume-controller.ts';

const router = Router();

router.post('/', createResumeController);
router.get('/:id', getResumeController);
router.get('/', getResumesController);
router.put('/:id', updateResumeController);
export { router as resumeRoute };