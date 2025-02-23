import { Server as httpServer } from 'http';
import { Server as SocketIOServer } from "socket.io";

const setupSocket = (server: httpServer) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "http://localhost:3000",
        },
    });
    
    io.on('connection', (socket) => {
        console.log(`${socket.id} user just connected!`);
    
        socket.on('join', (userId) => {
            socket.join(userId);
        })
    
        socket.on('updateColumns', (columns) => {
            socket.broadcast.emit('columnsUpdated', columns);
        })
            
        socket.on('disconnect', () => {
            console.log('User disconnected: ', socket.id);
        });
    });

    return io;
}

export default setupSocket;
