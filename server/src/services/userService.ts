import { UserModel } from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const generateUniqueUsername = async (name: string, surname: string): Promise<string> => {
    let baseUsername = `${name}${surname}`.toLowerCase().replace(/\s+g/, "");
    let username = baseUsername;
    let count = 1;

    while (await UserModel.exists({ username })) {
        username = `${baseUsername}${count}`;
        count++;
    }

    return username;
}

export const createUser = async (name: string, surname: string, email: string, password: string) => {
    const userExists = await UserModel.findOne({ email: email.toLowerCase() });

    if (userExists) {
        return {success: false, message: 'User already exists!' };
    }
    
    const username = await generateUniqueUsername(name, surname);

    const newUser = new UserModel({ name, surname, username, email, password, boards: [] });

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

    const payload = {
        id: user._id,
        username: user.username, 
        name: user.name, 
        surname: user.surname,
        email: user.email
    };

    // Signing the JWT with the payload
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    return {
        success: true,
        message: "Logged in!",
        user: {
            _id: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
        },
        token
    }
}

export const getUserProfile = async (userId: string) => {
    try {
        const user = await UserModel.findById(userId).populate('boards').select('-password');

        if (!user) {
            return { success: false, message: 'User not found.'};
        }

        return { success: true, user };
    } catch (error) {
        return { success: false, message: 'Error fetching user' };
    }
};
