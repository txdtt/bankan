"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const Column_1 = require("./model/Column");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default.connect('mongodb://localhost:27017/bankan')
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.error('Failed to connect to MongoDB: ', error);
});
app.post('/columns', async (req, res) => {
    try {
        const newColumn = new Column_1.ColumnModel({
            title: req.body.title,
            tasks: req.body.tasks
        });
        await newColumn.save();
        res.status(201).send(newColumn);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Failed to create column', details: error.message });
        }
        else {
            res.status(500).json({ error: 'Failed to create column', details: 'Unknown error' });
        }
    }
});
app.get('/columns', async (req, res) => {
    try {
        const columns = await Column_1.ColumnModel.find();
        res.send(columns);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error fetching columns', details: error.message });
        }
        else {
            res.status(500).json({ error: 'Error fetching columns', details: 'Unknown error' });
        }
    }
});
app.get('/columns/:id', async (req, res) => {
    try {
        const columnId = req.params.id;
        const column = await Column_1.ColumnModel.findOne({ id: columnId });
        if (!column) {
            return res.status(404).json({ message: 'Column not found!' });
        }
        res.status(200).json(column);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: 'Error fetching column', details: error.message });
        }
        else {
            return res.status(500).json({ error: 'Error fetching column', details: 'Unknown error' });
        }
    }
});
app.put('/columns/:id', async (req, res) => {
    try {
        const column = await Column_1.ColumnModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!column) {
            return res.status(404).json({ message: 'Column not found!' });
        }
        res.send(column);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error updating column', details: error.message });
        }
        else {
            res.status(500).json({ error: 'Error updating column', details: 'Unknown error' });
        }
    }
});
app.delete('/columns/:id', async (req, res) => {
    try {
        const column = await Column_1.ColumnModel.findByIdAndDelete(req.params.id);
        if (!column) {
            return res.status(404).json({ message: 'Column not found!' });
        }
        res.json({ message: 'Column deleted' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error deleting column', details: error.message });
        }
        else {
            res.status(500).json({ error: 'Error deleting column', details: 'Unknown error' });
        }
    }
});
app.patch('/columns/:id/tasks', async (req, res) => {
    try {
        const columnId = req.params.id;
        const newTask = req.body;
        const column = Column_1.ColumnModel.findByIdAndUpdate(columnId, { $push: { tasks: newTask } }, { new: true });
        if (!column) {
            return res.status(404).json({ message: 'Column not found!' });
        }
        res.json(column);
    }
    catch (error) {
        if (error instanceof Error) {
        }
    }
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
