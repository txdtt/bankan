import express from 'express';
import * as boardController from '../controllers/boardController.js';

const boardRouter = express.Router();

boardRouter.post('/create-board', boardController.createBoard);

boardRouter.post('/insert-board-in-user', boardController.insertBoardInUser);

boardRouter.get('/:boardId/get-columns', boardController.getColumns);

boardRouter.delete('/:boardId', boardController.deleteBoard);

boardRouter.post('/:boardId/add-column', boardController.addColumn);

boardRouter.delete('/:boardId/:id', boardController.deleteColumnById);

boardRouter.post('/:boardId/invite', boardController.inviteUser);

boardRouter.post('/:boardId/accept-invite', boardController.acceptInvite);

export default boardRouter;
