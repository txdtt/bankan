import { Request, Response } from 'express';
import * as boardService from '../services/boardService.js';

export const createBoard = async (req: Request, res: Response) => {
    const { title, userId } = req.body;

    try {
        const newBoard = await boardService.createBoard(title, userId);
        res.status(201).send(newBoard);
    } catch (error: unknown){
        if (error instanceof Error) {
            res.status(500).json({ error: 'Failed to create board: ', details: error.message });
        } 
    }
}

export const insertBoardInUser = async (req: Request, res: Response) => {
    const { userId, boardId } = req.body;

    try {
        const newBoardInUser = await boardService.insertBoardInUser(userId, boardId);
        res.status(201).send(newBoardInUser);
    } catch (error: unknown){
        if (error instanceof Error) {
            res.status(500).json({ error: 'Failed to insert board in user: ', details: error.message });
        } 
    }
}

export const deleteBoard = async (req: Request, res: Response) => {
    const { boardId } = req.body;

    try {
        const board = boardService.deleteBoard(boardId);
        if (!board) {
            return res.status(404).json({ message: 'Board not found!' });
        }
        res.json({ message: 'Board deleted' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Failed to delete board: ', details: error.message });
        }
    }
}

export const getColumns = async (req: Request, res: Response) => {
    const { boardId } = req.params;

    try {
        const columns = await boardService.getColumns(boardId);

        res.status(200).send(columns);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error fetching columns', details: error.message });
        } 
    }
}

export const addColumn = async (req: Request, res: Response) => {
    const { title, boardId } = req.body;

    try {
        const newColumn = await boardService.createColumn(title, boardId);
        res.status(201).send(newColumn);
    } catch (error: unknown){
        if (error instanceof Error) {
            res.status(500).json({ error: 'Failed to create column', details: error.message });
        } 
    }
}

export const deleteColumnById = async (req: Request, res: Response) => {
    try {
        const column = boardService.deleteColumnById(req.params.id);
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
    const columnId = req.params.id;

    try {
        const { title } = req.body;

        const column = await boardService.updateColumnTitle(columnId, title);

        res.status(200).json(column);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: 'Error patching column', details: error.message });
        } 
    }
}

export const inviteUser = async (req: Request, res: Response) => {
    const boardId = req.params.boardId;
    const { senderEmail, receiverEmail } = req.body;
    
    if (!boardId || !senderEmail || !receiverEmail) {
        return res.status(400).json({ 
            success: false, 
            message: "Missing required fields: boardId, senderEmail, and receiverEmail are required" 
        });
    }
    
    try {
        const newUserInBoard = await boardService.inviteUser(boardId, senderEmail, receiverEmail);
        res.status(201).send(newUserInBoard);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: 'Error inviting user', details: error.message });
        } 
        return res.status(500).json({ error: 'Unknown error occurred' });
    }
}

export const acceptInvite = async (req: Request, res: Response) => {
    const inviteId  = req.params.inviteId;

    try {
        const inviteAccepted = await boardService.acceptInvite(inviteId);
        res.status(201).send(inviteAccepted);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: 'Error accepting invite', details: error.message });
        } 
    }
}

export const getUserInvites = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const getInvites = await boardService.fetchUserInvites(userId);
        res.status(200).send(getInvites);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: 'Error accepting invite', details: error.message });
        } 
    }
}
