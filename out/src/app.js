"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importStar(require("mongoose"));
const Column_1 = require("./model/Column");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public', 'index.html'));
});
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
app.delete('/columns', async (req, res) => {
    const column = await Column_1.ColumnModel.deleteMany();
    try {
        if (!column) {
            return res.status(404).json({ message: 'Failed at deleting all columns!' });
        }
        res.json({ message: 'All columns deleted' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error deleting all columns', details: error.message });
        }
        else {
            res.status(500).json({ error: 'Error deleting all columns', details: 'Unknown error' });
        }
    }
});
app.patch('/columns/moveTask', async (req, res) => {
    const { sourceColumnId, targetColumnId, taskId } = req.body;
    if (!sourceColumnId || !targetColumnId || !taskId) {
        return res.status(400).json({ message: 'Invalid request data!' });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(sourceColumnId) ||
        !mongoose_1.default.Types.ObjectId.isValid(targetColumnId) ||
        !mongoose_1.default.Types.ObjectId.isValid(taskId)) {
        return res.status(400).send('Invalid ObjectId(s) provided');
    }
    const sourceColumnObjectId = mongoose_1.default.Types.ObjectId.createFromHexString(sourceColumnId);
    const targetColumnObjectId = mongoose_1.default.Types.ObjectId.createFromHexString(targetColumnId);
    const taskObjectId = mongoose_1.default.Types.ObjectId.createFromHexString(taskId);
    ;
    try {
        const sourceColumn = await Column_1.ColumnModel.findById(sourceColumnObjectId);
        if (!sourceColumn) {
            return res.status(404).json({ message: 'Source column not found!' });
        }
        const task = sourceColumn.tasks.find((t) => t._id && t._id.toString() === taskObjectId.toString());
        if (!task) {
            return res.status(404).json({ message: 'Task not found in source column!' });
        }
        await Column_1.ColumnModel.findByIdAndUpdate(sourceColumnObjectId, { $pull: { tasks: { _id: taskObjectId } } }, { new: true });
        const targetColumn = await Column_1.ColumnModel.findByIdAndUpdate(targetColumnObjectId, { $push: { tasks: task } }, { new: true });
        if (!targetColumn) {
            return res.status(404).json({ message: 'Target column not found!' });
        }
        res.status(200).send('Test successful!');
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error moving task:', error);
            res.status(500).json({ message: 'Server error', details: error.message });
        }
    }
});
app.get('/columns/:id', async (req, res) => {
    try {
        const columnId = req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(columnId)) {
            return res.status(400).json({ message: 'Invalid column ID format.' });
        }
        const column = await Column_1.ColumnModel.findOne({ _id: new mongoose_1.Types.ObjectId(columnId) });
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
app.patch('/columns/:id', async (req, res) => {
    try {
        const columnId = req.params.id;
        const { title } = req.body;
        const column = await Column_1.ColumnModel.findById(columnId);
        if (!column) {
            return res.status(404).json({ error: 'Column not found' });
        }
        column.title = title;
        await column.save();
        res.status(200).json(column);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: 'Error patching column', details: error.message });
        }
        else {
            return res.status(500).json({ error: 'Error patching column', details: 'Unknown error' });
        }
    }
});
app.patch('/columns/:id/reorder', async (req, res) => {
    try {
        const columnId = req.params.id;
        const { tasks } = req.body;
        console.log('Received columnId: ', columnId);
        console.log('Received tasks: ', tasks);
        const updatedColumn = await Column_1.ColumnModel.findByIdAndUpdate(columnId, { tasks: tasks }, { new: true });
        if (!updatedColumn) {
            return res.status(404).json({ message: 'Column not found!' });
        }
        console.log('Updated tasks: ', tasks);
        res.json(updatedColumn);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating task order!' });
    }
});
app.patch('/columns/:id/tasks/reorder', async (req, res) => {
    try {
        const columnId = req.params.id;
        const { tasks } = req.body;
        console.log('Received columnId:', columnId);
        console.log('Received tasks:', tasks);
        const updatedColumn = await Column_1.ColumnModel.findByIdAndUpdate(columnId, { tasks: tasks }, { new: true });
        if (!updatedColumn) {
            return res.status(404).json({ message: 'Column not found!' });
        }
        res.json(updatedColumn);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating task order!' });
    }
});
app.patch('/columns/:columnId/tasks/:taskId', async (req, res) => {
    try {
        const columnId = req.params.columnId;
        const taskId = req.params.taskId;
        const { title, description } = req.body;
        const column = await Column_1.ColumnModel.findById(columnId);
        if (!column) {
            return res.status(404).json({ error: 'Column not found' });
        }
        const task = column.tasks.find(task => { var _a; return ((_a = task._id) === null || _a === void 0 ? void 0 : _a.toString()) === taskId; });
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
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: 'Error patching task title', details: error.message });
        }
        else {
            return res.status(500).json({ error: 'Error patching title', details: 'Unknown error' });
        }
    }
});
app.get('/columns/:id/tasks', async (req, res) => {
    try {
        const columnId = req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(columnId)) {
            return res.status(400).json({ message: 'Invalid column ID format.' });
        }
        const column = await Column_1.ColumnModel.findOne({ _id: new mongoose_1.Types.ObjectId(columnId) });
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
app.patch('/columns/:id/tasks', async (req, res) => {
    try {
        const columnId = req.params.id;
        const newTask = req.body;
        const column = await Column_1.ColumnModel.findByIdAndUpdate(columnId, { $push: { tasks: newTask } }, { new: true });
        if (!column) {
            return res.status(404).json({ message: 'Column not found!' });
        }
        res.json(column);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
        }
    }
});
app.delete('/columns/:columnId/tasks/:taskId', async (req, res) => {
    try {
        const columnId = req.params.columnId;
        const taskId = req.params.taskId;
        const column = await Column_1.ColumnModel.findById(columnId);
        if (!column) {
            return res.status(404).json({ message: 'Column not found!' });
        }
        column.tasks = column.tasks.filter(task => { var _a; return ((_a = task._id) === null || _a === void 0 ? void 0 : _a.toString()) !== taskId; });
        await column.save();
        res.status(200).json({ message: 'Task deleted successfully! ' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
