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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskInColumn = exports.addTaskInColumn = exports.getTasksInColumn = exports.editTaskTitle = exports.reorderTasks = exports.updateColumnTitle = exports.deleteColumnById = exports.updateColumn = exports.getColumnById = exports.moveTask = exports.deleteColumns = exports.getColumns = exports.addColumn = void 0;
const columnService = __importStar(require("../services/columnService"));
const addColumn = async (req, res) => {
    try {
        const { title, tasks } = req.body;
        const newColumn = await columnService.createColumn(title, tasks);
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
};
exports.addColumn = addColumn;
const getColumns = async (req, res) => {
    try {
        const columns = await columnService.fetchColumns();
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
};
exports.getColumns = getColumns;
const deleteColumns = async (req, res) => {
    try {
        const result = await columnService.deleteColumns();
        if (!result) {
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
};
exports.deleteColumns = deleteColumns;
const moveTask = async (req, res) => {
    const { sourceColumnId, targetColumnId, taskId } = req.body;
    if (!sourceColumnId || !targetColumnId || !taskId) {
        return res.status(400).json({ message: 'Invalid request data!' });
    }
    try {
        const result = await columnService.moveTask(sourceColumnId, targetColumnId, taskId);
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json({ message: result.message });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error moving task:', error);
            res.status(500).json({ message: 'Server error', details: error.message });
        }
        else {
            res.status(500).json({ message: 'Unknown server error' });
        }
    }
};
exports.moveTask = moveTask;
const getColumnById = async (req, res) => {
    try {
        const columnId = req.params.id;
        const column = await columnService.fetchColumnById(columnId);
        res.status(200).json(column);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Invalid column ID format') {
                return res.status(400).json({ message: error.message });
            }
            if (error.message === 'Column not found') {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Error fetching column', details: error.message });
        }
        return res.status(500).json({ error: 'Unknown error' });
    }
};
exports.getColumnById = getColumnById;
const updateColumn = async (req, res) => {
    try {
        const columnId = req.params.id;
        const newInfoColumn = req.body;
        const column = await columnService.updateColumn(columnId, newInfoColumn);
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
};
exports.updateColumn = updateColumn;
const deleteColumnById = async (req, res) => {
    try {
        const column = columnService.deleteColumnById(req.params.id);
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
};
exports.deleteColumnById = deleteColumnById;
const updateColumnTitle = async (req, res) => {
    try {
        const columnId = req.params.id;
        const { title } = req.body;
        const column = await columnService.updateColumnTitle(columnId, title);
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
};
exports.updateColumnTitle = updateColumnTitle;
const reorderTasks = async (req, res) => {
    try {
        const columnId = req.params.id;
        const { tasks } = req.body;
        console.log('Received columnId: ', columnId);
        console.log('Received tasks: ', tasks);
        const updatedColumn = await columnService.reorderTasks(columnId, tasks);
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
};
exports.reorderTasks = reorderTasks;
const editTaskTitle = async (req, res) => {
    try {
        const columnId = req.params.columnId;
        const taskId = req.params.taskId;
        const { title, description } = req.body;
        const column = columnService.editTaskTitle(columnId, taskId, title, description);
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
};
exports.editTaskTitle = editTaskTitle;
const getTasksInColumn = async (req, res) => {
    try {
        const columnId = req.params.id;
        const column = await columnService.fetchTasksInColumn(columnId);
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
};
exports.getTasksInColumn = getTasksInColumn;
const addTaskInColumn = async (req, res) => {
    try {
        const columnId = req.params.id;
        const newTask = req.body;
        const column = await columnService.addTaskInColumn(columnId, newTask);
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
};
exports.addTaskInColumn = addTaskInColumn;
const deleteTaskInColumn = async (req, res) => {
    try {
        const columnId = req.params.columnId;
        const taskId = req.params.taskId;
        await columnService.deleteTaskInColumn(columnId, taskId);
        res.status(200).json({ message: 'Task deleted successfully! ' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteTaskInColumn = deleteTaskInColumn;
