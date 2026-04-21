import { Router } from 'express';
import {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  toggleTask,
  bulkDeleteTasks,
  duplicateTask,
} from '../controllers/taskController';
import { taskValidator } from '../validators';
import validate from '../middleware/validate';
import protect from '../middleware/auth';

const router = Router();

// All task routes are protected
router.use(protect as any);

router.get('/', getTasks as any);
router.post('/', taskValidator, validate, createTask as any);
router.delete('/bulk', bulkDeleteTasks as any);
router.get('/:id', getTask as any);
router.put('/:id', taskValidator, validate, updateTask as any);
router.delete('/:id', deleteTask as any);
router.patch('/:id/toggle', toggleTask as any);
router.post('/:id/duplicate', duplicateTask as any);

export default router;
