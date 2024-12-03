import express from 'express';
import * as columnController from '../controllers/columnController';

const router = express.Router();

router.post('/columns', columnController.addColumn);

router.get('/columns', columnController.getColumns);

router.patch('/columns/moveTask', columnController.moveTask);

router.get('/columns/:id', columnController.getColumnById);

router.delete('/columns/:id', columnController.deleteColumnById);

router.patch('/columns/:id', columnController.updateColumnTitle);

router.patch('/columns/:id/reorder', columnController.reorderTasks);

router.patch('/columns/:id/tasks', columnController.editTaskTitle);

router.get('/columns/:id/tasks', columnController.getTasksInColumn);

router.patch('/columns/:id/tasks', columnController.addTaskInColumn);

router.delete('/columns/:columnId/tasks/:taskId', columnController.deleteTaskInColumn);

export default router;
