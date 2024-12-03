import { Request, Response } from 'express';
import * as columnService from '../services/columnService';

export const addColumn = async (req: Request, res: Response) => {
    try {
        const { title, tasks } = req.body;
        const newColumn = await columnService.createColumn(title, tasks);
        res.status(201).send(newColumn);
    } catch (error: unknown){
        if (error instanceof Error) {
            res.status(500).json({ error: 'Failed to create column', details: error.message });
        } else {
            res.status(500).json({ error: 'Failed to create column', details: 'Unknown error' });
        }
    }
}

export const getColumns = async (req: Request, res: Response) => {
    try {
        const columns = await columnService.fetchColumns();
        res.send(columns);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error fetching columns', details: error.message });
        } else {
            res.status(500).json({ error: 'Error fetching columns', details: 'Unknown error' });
        }
    }
}

export const deleteColumns = async(req: Request, res: Response) => {
    try {
        const result = await columnService.deleteColumns();

        if (!result) {
            return res.status(404).json({ message: 'Failed at deleting all columns!' });
        }

        res.json({ message: 'All columns deleted' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error deleting all columns', details: error.message });
        }  else {
            res.status(500).json({ error: 'Error deleting all columns', details: 'Unknown error' });
        }
    }
}

export const moveTask = async(req: Request, res: Response) => {
    const { sourceColumnId, targetColumnId, taskId } = req.body;

    if (!sourceColumnId || !targetColumnId || !taskId) {
        return res.status(400).json({ message: 'Invalid request data!' });
    }

    try {
        const result = await columnService.moveTask(sourceColumnId, targetColumnId, taskId);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        res.status(200).json({ message: result.message });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error moving task:', error);
            res.status(500).json({ message: 'Server error', details: error.message });
        } else {
            res.status(500).json({ message: 'Unknown server error' });
        }
    }
}

export const getColumnById = async (req: Request, res: Response) => {
    try {
        const columnId = req.params.id;
        const column = await columnService.fetchColumnById(columnId);
        res.status(200).json(column);
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.message === 'Invalid column ID format') {
                return res.status(400).json({ message: error.message });
            }
            if (error.message === 'Column not found') {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Error fetching column', details: error.message });
        }
        return res.status(500).json({ error: 'Unknown error' });
    }
}

export const updateColumn = async (req: Request, res: Response) => {
    try {
        const columnId = req.params.id;
        const newInfoColumn = req.body

        const column = await columnService.updateColumn(columnId, newInfoColumn);
        if (!column) {
            return res.status(404).json({ message: 'Column not found!' });
        }

        res.send(column);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error updating column', details: error.message });
        } else {
            res.status(500).json({ error: 'Error updating column', details: 'Unknown error' });
        }
    }
}

export const deleteColumnById = async (req: Request, res: Response) => {
    try {
        const column = columnService.deleteColumnById(req.params.id);
        if (!column) {
            return res.status(404).json({ message: 'Column not found!' });
        }
        res.json({ message: 'Column deleted' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error deleting column', details: error.message });
        } else {
            res.status(500).json({ error: 'Error deleting column', details: 'Unknown error' });
        }
    }
}

export const updateColumnTitle = async (req: Request, res: Response) => {
    try {
        const columnId = req.params.id;
        const { title } = req.body;

        const column = await columnService.updateColumnTitle(columnId, title);

        res.status(200).json(column);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: 'Error patching column', details: error.message });
        } else {
            return res.status(500).json({ error: 'Error patching column', details: 'Unknown error' });
        }
    }
}

export const reorderTasks = async (req: Request, res: Response) => {
    try {
        const columnId = req.params.id;
        const { tasks } = req.body;

        console.log('Received columnId: ', columnId);
        console.log('Received tasks: ', tasks);

        const updatedColumn = await columnService.reorderTasks(columnId, tasks);

        if (!updatedColumn) {
            return res.status(404).json({ message: 'Column not found!' });
        }

        console.log('Updated tasks: ', tasks);

        res.json(updatedColumn);
    } catch (error: unknown) {
        console.error(error); 
        res.status(500).json({ message: 'Error updating task order!' });
    }
}

export const editTaskTitle = async (req: Request, res: Response) => {
    try {
        const columnId = req.params.columnId;
        const taskId = req.params.taskId;
        const { title, description } = req.body;

        const column = columnService.editTaskTitle(columnId, taskId, title, description);

        res.status(200).json(column);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: 'Error patching task title', details: error.message });
        } else {
            return res.status(500).json({ error: 'Error patching title', details: 'Unknown error' });
        }
    }
}

export const getTasksInColumn = async (req: Request, res: Response) => {
    try {
        const columnId = req.params.id;

        const column = await columnService.fetchTasksInColumn(columnId);

        res.status(200).json(column);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ error: 'Error fetching column', details: error.message });
        } else {
            return res.status(500).json({ error: 'Error fetching column', details: 'Unknown error' });
        }
    }
}

export const addTaskInColumn = async (req: Request, res: Response) => {
    try {
        const columnId = req.params.id;
        const newTask = req.body;

        const column = await columnService.addTaskInColumn(columnId, newTask);

        if (!column) {
            return res.status(404).json({ message: 'Column not found!' });
        }

        res.json(column);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error);
        }
    }
}

export const deleteTaskInColumn = async (req: Request, res: Response) => {
    try {
        const columnId = req.params.columnId;
        const taskId = req.params.taskId;

        await columnService.deleteTaskInColumn(columnId, taskId);

        res.status(200).json({ message: 'Task deleted successfully! '});
    } catch (error: unknown) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
