import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/profile', protect, userController.getUserProfile);

userRouter.post('/create-user', userController.createUser);

userRouter.post('/login', userController.authenticateUser);

export default userRouter;
