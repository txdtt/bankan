import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            req.user = await UserModel.findById((decoded as any).id).select("-password");

            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, invalid token"});
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token"});
    }
}
