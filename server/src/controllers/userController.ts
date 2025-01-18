import { Request, Response } from 'express';
import * as userService from '../services/userService.js';

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const newUser = await userService.createUser(name, email, password);
        res.status(201).send(newUser);
    } catch (error: unknown){
        if (error instanceof Error) {
            res.status(500).json({ error: 'Failed to create user: ', details: error.message });
        } 
    }
}

export const authenticateUser = async (req: Request, res: Response) => {
    try {
        const { name, password }= req.body;
        const userAuth = await userService.authenticateUser(name, password);
        res.status(200).send(userAuth);
    } catch (error: unknown){
        if (error instanceof Error) {
            res.status(500).json({ error: 'Failed to authenticate user: ', details: error.message });
        } 
    }
}
