import express from 'express';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', logInUser);
router.get('/logout', logOutUser);
router.get('/profile', protect, getProfile);

export default router;