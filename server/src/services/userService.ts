import mongoose, { Types } from 'mongoose';
import { UserModel, User } from '../models/userModel.js';

export const createUser = async (name: string, email: string, password: string) => {
    const newUser = new UserModel({ name, email, password, teams: [], boards: [] });
    return await newUser.save();
}

export const authenticateUser = async (name: string, password: string) => {
    const userAuth = await UserModel.findOne({ name });

    if (userAuth && password === userAuth.password) {
        console.log(name, 'logged in!');
        return;
    } 

    console.log('Authentication failed!');
}
