import { Request, Response } from 'express';
import * as userService from '../services/userService.js';
import UserModel from '../models/userModel.js';

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

interface AuthRequest extends Request {
    user?: any;
}

export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const response = await userService.getUserProfile(req.user._id);

        if (!response.success) {
            return res.status(404).json(response);
        }

        res.status(200).json(response);

    } catch (error: unknown ){
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
}
