import express  from 'express';
import cors from 'cors';
import path from 'path';
import columnRouter  from './routes/columnRoutes.js'
import { connectDatabase } from './config/database.js'

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..')));

connectDatabase();

app.use('/api/columns', columnRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app;
