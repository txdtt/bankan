import express from 'express';
import * as boardController from '../controllers/boardController.js';

const boardRouter = express.Router();

boardRouter.post('/create-board', boardController.createBoard);

export default boardRouter;
