import express from 'express';
import * as columnController from '../controllers/columnController.js';

const columnRouter = express.Router();

columnRouter.get('/', columnController.getColumns);

columnRouter.post('/', columnController.addColumn);

columnRouter.delete('/', columnController.deleteColumns);

columnRouter.get('/:id', columnController.getColumnById);

columnRouter.delete('/:id', columnController.deleteColumnById);

columnRouter.patch('/:id', columnController.updateColumnTitle);

columnRouter.patch('/:id/reorder', columnController.reorderTasks);

export default columnRouter;
