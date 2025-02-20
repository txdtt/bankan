import express  from 'express';
import cors from 'cors';
import http from 'http'
import path from 'path';
import columnRouter  from './routes/columnRoutes.js'
import { connectDatabase } from './config/database.js'
import taskRouter from './routes/taskRoutes.js';
import userRouter from './routes/userRoutes.js';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import boardRouter from './routes/boardRoutes.js';

dotenv.config();

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..')));

connectDatabase();

app.use('/api/user', userRouter);
app.use('/api/board', boardRouter);
app.use('/api/columns', columnRouter, taskRouter);

const clientPath = path.join(__dirname, '..', '..', 'client', 'dist'); 
app.use(express.static(clientPath));

const server = http.createServer(app);

const socketIO = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});

socketIO.on('connection', (socket) => {
    console.log(`${socket.id} user just connected!`);

    socket.on('updateColumns', (columns) => {
        socket.broadcast.emit('columnsUpdated', columns);
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

app.get('*', (_, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
});

export default app;
