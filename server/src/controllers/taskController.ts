import { Request, Response } from 'express';
import * as taskService from '../services/taskService.js';

export const moveTask = async(req: Request, res: Response) => {
    const { sourceColumnId, targetColumnId, taskId } = req.body;

    if (!sourceColumnId || !targetColumnId || !taskId) {
        return res.status(400).json({ message: 'Invalid request data!' });
    }

    try {
        const result = await taskService.moveTask(sourceColumnId, targetColumnId, taskId);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        res.status(200).json({ message: result.message });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error moving task: ', details: error.message });
        } 
    }
}

export const editTaskTitle = async (req: Request, res: Response) => {
    try {
        const columnId = req.params.columnId;
        const taskId = req.params.taskId;
        const { title, description } = req.body;

        const column = taskService.editTaskTitle(columnId, taskId, title, description);

        res.status(200).json(column);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: 'Error patching task title', details: error.message });
        } 
    }
}

export const getTasksInColumn = async (req: Request, res: Response) => {
    try {
        const columnId = req.params.id;

        const column = await taskService.fetchTasksInColumn(columnId);

        return res.status(200).json({ success: true, tasks: column.tasks });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: 'Error fetching column', details: error.message });
        } 
    }
}

export const addTaskToColumn = async (req: Request, res: Response) => {
    try {
        const columnId = req.params.id;
        const newTask = req.body;

        const addedTask = await taskService.addTaskToColumn(columnId, newTask);

        if (!addedTask.success) {
            return res.status(404).json({ message: addedTask.message});
        }

        return res.status(200).json({
            success: true,
            message: addedTask.message,
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: 'Error adding task to column', details: error.message });
        }
    }
}

export const deleteTaskInColumn = async (req: Request, res: Response) => {
    try {
        const columnId = req.params.columnId;
        const taskId = req.params.taskId;

        await taskService.deleteTaskInColumn(columnId, taskId);

        res.status(200).json({ message: 'Task deleted successfully!'});
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Internal server error', details: error.message });
        }
    }
}
