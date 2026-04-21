import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { registerValidator, loginValidator } from '../validators';
import validate from '../middleware/validate';
import protect from '../middleware/auth';

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.get('/me', protect as any, getMe as any);

export default router;
