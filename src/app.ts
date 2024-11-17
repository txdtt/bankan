import express, { response } from 'express';
import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
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

        if (!Types.ObjectId.isValid(columnId)) {
            return res.status(400).json({ message: 'Invalid column ID format.' });
        }

        const column = await ColumnModel.findOne({ _id: new Types.ObjectId(columnId) });

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

app.patch('/columns/:id', async (req: Request, res: Response) => {
    try {
        const columnId = req.params.id;
        const { title } = req.body;

        const column = await ColumnModel.findById(columnId);

        if (!column) {
            return res.status(404).json({ error: 'Column not found' });
        }

        column.title = title;

        await column.save();

        res.status(200).json(column);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: 'Error patching column', details: error.message });
        } else {
            return res.status(500).json({ error: 'Error patching column', details: 'Unknown error' });
        }
    }
});

app.patch('/columns/:columnId/tasks/:taskId', async (req: Request, res: Response) => {
    try {
        const columnId = req.params.columnId;
        const taskId = req.params.taskId;
        const { title, description } = req.body;

        const column = await ColumnModel.findById(columnId);

        if (!column) {
            return res.status(404).json({ error: 'Column not found' });
        }

        const task = column.tasks.find(task => task._id?.toString() === taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (title) {
            task.title = title;
        }

        if (description) {
            task.description = description;
        }

        await column.save();

        res.status(200).json(column);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: 'Error patching task title', details: error.message });
        } else {
            return res.status(500).json({ error: 'Error patching title', details: 'Unknown error' });
        }
    }
});

app.delete('/columns', async (req: Request, res: Response) => {
    const column = await ColumnModel.deleteMany();

    try {
        if (!column) {
            return res.status(404).json({ message: 'Failed at deleting all columns!' });
        }

        res.json({ message: 'All columns deleted' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error deleting all columns', details: error.message });
        }  else {
            res.status(500).json({ error: 'Error deleting all columns', details: 'Unknown error' });
        }
    }


});

app.get('/columns/:id/tasks', async (req: Request, res: Response) => {
    try {
        const columnId = req.params.id;

        if (!Types.ObjectId.isValid(columnId)) {
            return res.status(400).json({ message: 'Invalid column ID format.' });
        }

        const column = await ColumnModel.findOne({ _id: new Types.ObjectId(columnId) });

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

app.patch('/columns/:id/tasks', async (req: Request, res: Response) => {
    try {
        const columnId = req.params.id;
        const newTask = req.body;

        const column = await ColumnModel.findByIdAndUpdate(
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
});

app.patch('/columns/:id/tasks/reorder', async (req: Request, res: Response) => {
    try {
        const columnId = req.params.id;
        const { tasks } = req.body;

        const updatedColumn = await ColumnModel.findByIdAndUpdate(
            columnId,
            { tasks: tasks },
            { new: true }
        );

        if (!updatedColumn) {
            return res.status(404).json({ message: 'Column not found!' });
        }

        res.json(updatedColumn);
    } catch (error: unknown) {
        console.error(error); 
        res.status(500).json({ message: 'Error updating task order!' });
    }
});

app.delete('/columns/:columnId/tasks/:taskId', async (req: Request, res: Response) => {
    try {
        const columnId = req.params.columnId;
        const taskId = req.params.taskId;

        const column = await ColumnModel.findById(columnId);

        if (!column) {
            return res.status(404).json({ message: 'Column not found!' });
        }

        column.tasks = column.tasks.filter(task => task._id?.toString() !== taskId);

        await column.save();

        res.status(200).json({ message: 'Task deleted successfully! '});
    } catch (error: unknown) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
