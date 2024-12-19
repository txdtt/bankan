import express from 'express';
import * as columnController from '../controllers/columnController.js';

const columnRouter = express.Router();

columnRouter.get('/', columnController.getColumns);

columnRouter.post('/', columnController.addColumn);

columnRouter.delete('/', columnController.deleteColumns);

columnRouter.patch('/moveTask', columnController.moveTask);

columnRouter.get('/:id', columnController.getColumnById);

columnRouter.delete('/:id', columnController.deleteColumnById);

columnRouter.patch('/:id', columnController.updateColumnTitle);

columnRouter.patch('/:id/reorder', columnController.reorderTasks);

columnRouter.get('/:id/tasks', columnController.getTasksInColumn);

columnRouter.patch('/:id/tasks', columnController.addTaskToColumn);

columnRouter.patch('/:columnId/tasks/:taskId', columnController.editTaskTitle);

columnRouter.delete('/:columnId/tasks/:taskId', columnController.deleteTaskInColumn);

export default columnRouter;
