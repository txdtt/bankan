import express from 'express';
import * as taskController from '../controllers/taskController.js';

const taskRouter = express.Router();

taskRouter.patch('/moveTask', taskController.moveTask);

taskRouter.get('/:id/tasks', taskController.getTasksInColumn);

taskRouter.patch('/:id/tasks', taskController.addTaskToColumn);

taskRouter.patch('/:columnId/tasks/:taskId', taskController.editTaskTitle);

taskRouter.delete('/:columnId/tasks/:taskId', taskController.deleteTaskInColumn);

export default taskRouter;
