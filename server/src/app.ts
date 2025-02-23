import express  from 'express';
import cors from 'cors';
import http from 'http'
import path from 'path';
import { connectDatabase } from './config/database.js'
import userRouter from './routes/userRoutes.js';
import dotenv from 'dotenv';
import boardRouter from './routes/boardRoutes.js';
import setupSocket from './sockets/socketServer.js';

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

const clientPath = path.join(__dirname, '..', '..', 'client', 'dist'); 
app.use(express.static(clientPath));

const server = http.createServer(app);

export const io = setupSocket(server);

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

app.get('*', (_, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
});

export default app;
