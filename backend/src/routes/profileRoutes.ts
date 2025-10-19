import { Router } from 'express';
import * as profileController from '../controllers/profileController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', authenticate, profileController.getProfile);
router.put('/', authenticate, profileController.updateProfile);

router.post(
  '/photos',
  authenticate,
  upload.single('photo'),
  profileController.uploadPhoto
);
router.delete('/photos/:id', authenticate, profileController.deletePhoto);

router.post('/prompts', authenticate, profileController.addPromptAnswer);
router.put('/prompts/:id', authenticate, profileController.updatePromptAnswer);
router.delete('/prompts/:id', authenticate, profileController.deletePromptAnswer);

// AI insight endpoint
router.post('/generate-insight', authenticate, profileController.generateAIInsight);

// Reset user profile endpoint
router.post('/reset-user', authenticate, profileController.resetUserProfile);

export default router;

