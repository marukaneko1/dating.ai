import { Router } from 'express';
import * as matchController from '../controllers/matchController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, matchController.getMatches);
router.delete('/:id', authenticate, matchController.deleteMatch);

export default router;

