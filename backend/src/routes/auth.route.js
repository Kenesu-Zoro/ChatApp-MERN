import express from 'express';
import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/protectRoute.middleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

//middleware to protect routes can be added here
router.put('/update-profile', protectedRoute, updateProfile);
router.get('/check-auth', protectedRoute, checkAuth);

export default router;