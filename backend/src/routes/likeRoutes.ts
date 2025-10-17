import { Router } from 'express';
import * as likeController from '../controllers/likeController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, likeController.createLike);
router.delete('/:id', authenticate, likeController.deleteLike);
router.get('/sent', authenticate, likeController.getSentLikes);
router.get('/received', authenticate, likeController.getReceivedLikes);

export default router;

