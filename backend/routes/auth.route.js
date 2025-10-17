import express from 'express';
import { registerUser, logInUser, logOutUser, getProfile, refreshToken } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', logInUser);
router.get('/logout', logOutUser);
router.get('/profile', protect, getProfile);
router.post('/refresh-token', refreshToken);

export default router;