import express  from 'express';
import cors from 'cors';
import path from 'path';
import columnRoutes from './routes/columnRoutes'
import { connectDatabase } from './config/database'

const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/columns', columnRoutes);

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

connectDatabase();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
