import express from 'express';
import * as userController from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/', userController.authenticateUser);

userRouter.post('/', userController.createUser);

export default userRouter;
