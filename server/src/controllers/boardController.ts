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
