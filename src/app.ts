import express from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ColumnModel } from './model/Column';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/bankan')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB: ', error);
});

app.post('/columns', async (req: Request, res: Response) => {
    try {
        const newColumn = new ColumnModel({
            title: req.body.title,
            tasks: req.body.tasks
        });

        await newColumn.save();
        res.status(201).send(newColumn);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Failed to create column', details: error.message });
        } else {
            res.status(500).json({ error: 'Failed to create column', details: 'Unknown error' });
        }
    }
});

app.get('/columns', async (req: Request, res: Response) => {
    try {
        const columns = await ColumnModel.find();
        res.send(columns);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error fetching columns', details: error.message });
        } else {
            res.status(500).json({ error: 'Error fetching columns', details: 'Unknown error' });
        }
    }
});

app.get('/columns/:id', async (req: Request, res: Response) => {
    try {
        const columnId = req.params.id;
        const column = await ColumnModel.findOne({ id: columnId });
        if (!column) {
            return res.status(404).json({ message: 'Column not found!' });
        }
        res.status(200).json(column);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ error: 'Error fetching column', details: error.message });
        } else {
            return res.status(500).json({ error: 'Error fetching column', details: 'Unknown error' });
        }
    }
});

app.put('/columns/:id', async (req: Request, res: Response) => {
    try {
        const column = await ColumnModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!column) {
            return res.status(404).json({ message: 'Column not found!' });
        }
        res.send(column);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error updating column', details: error.message });
        } else {
            res.status(500).json({ error: 'Error updating column', details: 'Unknown error' });
        }
    }
});

app.delete('/columns/:id', async (req: Request, res: Response) => {
    try {
        const column = await ColumnModel.findByIdAndDelete(req.params.id);
        if (!column) {
            return res.status(404).json({ message: 'Column not found!' });
        }
        res.json({ message: 'Column deleted' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error deleting column', details: error.message });
        } else {
            res.status(500).json({ error: 'Error deleting column', details: 'Unknown error' });
        }
    }
});

app.patch('/columns/:id/tasks', async (req: Request, res: Response) => {
    try {
        const columnId = req.params.id;
        const newTask = req.body;

        const column = ColumnModel.findByIdAndUpdate(
            columnId,
            { $push: { tasks: newTask } },
            { new: true }
        );

        if (!column) {
            return res.status(404).json({ message: 'Column not found!' });
        }

        res.json(column);
    } catch (error: unknown) {
        if (error instanceof Error) {

        }
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
