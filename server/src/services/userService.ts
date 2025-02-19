import { UserModel } from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const createUser = async (name: string, surname: string, email: string, password: string) => {
    const userExists = await UserModel.findOne({ email: email.toLowerCase() });
    if (userExists) {
        return {success: false, message: 'User already exists!' };
    }
    const newUser = new UserModel({ name, surname, email, password, boards: [] });
    return await newUser.save();
}

export const authenticateUser = async (email: string, password: string) => {
    const user = await UserModel.findOne({ email: email.toLowerCase() });

    if (!user) {
        return {success: false, message: 'Invalid email or password!' };
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
        return {success: false, message: 'Invalid email or password!' };
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1h"});

    return {
        success: true,
        message: "Logged in!",
        user: {
            _id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
        },
        token
    }
}
