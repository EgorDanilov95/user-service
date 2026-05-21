import Router from 'koa-router';
import { authMiddleware } from '../middleware/auth';
import { requireAdmin } from '../middleware/requireAdmin';
import {
  registerController,
  loginController,
  getUserByIdController,
  getUsersListController,
  blockUserController,
} from '../controllers/userController';

const router = new Router();


router.post('/api/register', registerController);
router.post('/api/login', loginController);


router.get('/api/users/:id', authMiddleware, getUserByIdController);
router.patch('/api/users/:id/block', authMiddleware, blockUserController);


router.get('/api/users', authMiddleware, requireAdmin, getUsersListController);

router.get('/health', (ctx) => {
  ctx.body = { status: 'ok' };
});

export default router;