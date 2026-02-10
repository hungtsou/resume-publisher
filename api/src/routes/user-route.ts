import { Router } from 'express';
import { createUserController, getUsersController, getUserController } from '../controllers/user-controller.ts';

const router = Router();

router.post('/', createUserController);
router.get('/', getUsersController);
router.get('/:id', getUserController);

export { router as userRoute };