import { Router } from 'express';
import { authenticate,authorize } from '../middleware/auth.js';
import { listUsers } from '../controllers/userController.js';
const router=Router(); router.get('/',authenticate,authorize('agent'),listUsers); export default router;
