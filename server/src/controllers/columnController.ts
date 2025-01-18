import { Request, Response } from 'express';
import * as columnService from '../services/columnService.js';

export const getColumns = async (_: Request, res: Response) => {
    try {
        const columns = await columnService.fetchColumns();
        res.send(columns);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error fetching columns', details: error.message });
        } 
    }
}

export const addColumn = async (req: Request, res: Response) => {
    try {
        const { title } = req.body;
        const newColumn = await columnService.createColumn(title);
        res.status(201).send(newColumn);
    } catch (error: unknown){
        if (error instanceof Error) {
            res.status(500).json({ error: 'Failed to create column', details: error.message });
        } 
    }
}

export const deleteColumns = async(_: Request, res: Response) => {
    try {
        const result = await columnService.deleteColumns();

        if (!result) {
            return res.status(404).json({ message: 'Failed at deleting all columns!' });
        }

        res.json({ message: 'All columns deleted' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error deleting all columns', details: error.message });
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error updating column', details: error.message });
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
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: 'Error updating task order!', details: error.message });
        } 
    }
}
