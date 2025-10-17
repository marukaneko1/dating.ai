import { Router } from 'express';
import * as discoveryController from '../controllers/discoveryController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, discoveryController.getNextProfile);

export default router;

