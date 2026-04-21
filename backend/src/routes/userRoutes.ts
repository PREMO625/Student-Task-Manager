import { Router } from 'express';
import {
  updateProfile,
  updatePassword,
  deleteAccount,
} from '../controllers/userController';
import {
  updateProfileValidator,
  updatePasswordValidator,
} from '../validators';
import validate from '../middleware/validate';
import protect from '../middleware/auth';

const router = Router();

router.use(protect as any);

router.put('/profile', updateProfileValidator, validate, updateProfile as any);
router.put('/password', updatePasswordValidator, validate, updatePassword as any);
router.delete('/account', deleteAccount as any);

export default router;
