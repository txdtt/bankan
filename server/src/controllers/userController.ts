import { Request, Response } from 'express';
import * as userService from '../services/userService.js';

export const createUser = async (req: Request, res: Response) => {
    const { name, surname, email, password } = req.body;

    try {
        const newUser = await userService.createUser(name, surname, email, password);
        res.status(201).send(newUser);
    } catch (error: unknown){
        if (error instanceof Error) {
            res.status(500).json({ error: 'Failed to create user: ', details: error.message });
        } 
    }
}

export const authenticateUser = async (req: Request, res: Response) => {
    const { email, password }= req.body;

    try {
        const response = await userService.authenticateUser(email, password);

        if (!response.success) {
            return res.status(401).json(response);
        }

        res.status(200).send(response);
    } catch (error: unknown){
        if (error instanceof Error) {
            res.status(500).json({ error: 'Failed to authenticate user: ', details: error.message });
        } 
    }
}
