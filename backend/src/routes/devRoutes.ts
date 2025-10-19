import { Router } from 'express';
import * as devController from '../controllers/devController';
import { testOpenAIConnection } from '../services/openaiService';

const router = Router();

// Get all users with their profiles
router.get('/users', devController.getAllUsers);

// Get database statistics
router.get('/stats', devController.getStats);

// Get all likes
router.get('/likes', devController.getAllLikes);

// Get all matches
router.get('/matches', devController.getAllMatches);

// Get all messages
router.get('/messages', devController.getAllMessages);

// Test OpenAI connection
router.get('/test-openai', async (req, res) => {
  try {
    const success = await testOpenAIConnection();
    res.json({ success, message: success ? 'OpenAI connected!' : 'OpenAI connection failed' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to test OpenAI' });
  }
});

export default router;

