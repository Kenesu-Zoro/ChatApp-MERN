import express from 'express';
import { protectedRoute } from '../middleware/protectRoute.middleware.js';
import { getUsersForSidebar,  getMessagesWithUser, sendMessagesToUser } from '../controllers/message.controller.js';

const router = express.Router();

// Get users for sidebar and messages with a specific user
router.get('/users', protectedRoute, getUsersForSidebar);
router.get('/:id', protectedRoute, getMessagesWithUser); 

//send messages from me
router.post('/send/:id', protectedRoute, sendMessagesToUser)
export default router;