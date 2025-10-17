import { Router } from 'express';
import * as messageController from '../controllers/messageController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/:matchId', authenticate, messageController.getMessages);
router.post('/', authenticate, messageController.sendMessage);
router.put('/:matchId/read', authenticate, messageController.markMessagesAsRead);

export default router;

