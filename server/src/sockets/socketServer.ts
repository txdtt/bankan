import { Server as httpServer } from 'http';
import { Server as SocketIOServer } from "socket.io";
import { Socket } from "socket.io";
import jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends Socket {
    user?: { id: string; username: string };
}

const activeUsers: Record<string, string> = {};

const setupSocket = (server: httpServer) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        },
    });

    io.use((socket: AuthenticatedSocket, next) => {
        //console.log("Token received:", socket.handshake.auth?.token);
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }
    
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; username: string };
            socket.user = user; 
            console.log("Authenticated user:", user.username);
            next();
        } catch (error) {
            return next(new Error("Authentication error: Invalid token"));
        }
    });

    
    io.on('connection', (socket: AuthenticatedSocket) => {
        console.log(`User connected: ${socket.user?.username}`);
        console.log("Socket ID:", socket.id);

        activeUsers[socket.user?.id as string] = socket.id;

        socket.on('updateColumns', (columns) => {
            socket.broadcast.emit('columnsUpdated', columns);
        })
            
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user?.username}`);
            if (socket.user?.id) {
                delete activeUsers[socket.user.id]; 
            }
        });
    });

    return io;
}

export default setupSocket;
