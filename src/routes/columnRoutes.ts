import express from 'express';
import * as columnController from '../controllers/columnController';

const router = express.Router();

router.get('/', columnController.getColumns);

router.post('/', columnController.addColumn);

router.delete('/', columnController.deleteColumns);

router.patch('/moveTask', columnController.moveTask);

router.get('/:id', columnController.getColumnById);

router.delete('/:id', columnController.deleteColumnById);

router.patch('/:id', columnController.updateColumnTitle);

router.patch('/:id/reorder', columnController.reorderTasks);

router.get('/:id/tasks', columnController.getTasksInColumn);

router.patch('/:id/tasks', columnController.addTaskToColumn);

router.patch('/:id/tasks/:taskId', columnController.editTaskTitle);

router.delete('/:columnId/tasks/:taskId', columnController.deleteTaskInColumn);

export default router;
