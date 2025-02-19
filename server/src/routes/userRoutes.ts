import express from 'express';
import * as userController from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/create-user', userController.createUser);

userRouter.post('/login', userController.authenticateUser);

export default userRouter;
