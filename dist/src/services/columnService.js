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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskInColumn = exports.addTaskToColumn = exports.fetchTasksInColumn = exports.editTaskTitle = exports.reorderTasks = exports.updateColumnTitle = exports.deleteColumnById = exports.updateColumn = exports.fetchColumnById = exports.moveTask = exports.deleteColumns = exports.createColumn = exports.fetchColumns = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const taskModel_1 = __importDefault(require("../models/taskModel"));
const columnModel_1 = require("../models/columnModel");
const fetchColumns = async () => {
    return await columnModel_1.ColumnModel.find().populate('tasks');
};
exports.fetchColumns = fetchColumns;
const createColumn = async (title) => {
    const newColumn = new columnModel_1.ColumnModel({ title, tasks: [] });
    return await newColumn.save();
};
exports.createColumn = createColumn;
const deleteColumns = async () => {
    return await columnModel_1.ColumnModel.deleteMany({});
};
exports.deleteColumns = deleteColumns;
const moveTask = async (sourceColumnId, targetColumnId, taskId) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(sourceColumnId) ||
        !mongoose_1.default.Types.ObjectId.isValid(targetColumnId) ||
        !mongoose_1.default.Types.ObjectId.isValid(taskId)) {
        return { success: false, message: 'Invalid ObjectId(s) provided' };
    }
    const sourceColumnObjectId = mongoose_1.default.Types.ObjectId.createFromHexString(sourceColumnId);
    const targetColumnObjectId = mongoose_1.default.Types.ObjectId.createFromHexString(targetColumnId);
    const taskObjectId = mongoose_1.default.Types.ObjectId.createFromHexString(taskId);
    const sourceColumn = await columnModel_1.ColumnModel.findById(sourceColumnObjectId);
    if (!sourceColumn) {
        return { success: false, message: 'Source column not found!' };
    }
    const task = sourceColumn.tasks.find((t) => { var _a; return ((_a = t._id) === null || _a === void 0 ? void 0 : _a.toString()) === taskObjectId.toString(); });
    if (!task) {
        return { success: false, message: 'Task not found in source column!' };
    }
    await columnModel_1.ColumnModel.findByIdAndUpdate(sourceColumnObjectId, { $pull: { tasks: { _id: taskObjectId } } }, { new: true });
    const targetColumn = await columnModel_1.ColumnModel.findByIdAndUpdate(targetColumnObjectId, { $push: { tasks: task } }, { new: true });
    if (!targetColumn) {
        return { success: false, message: 'Target column not found!' };
    }
    return { success: true, message: 'Task moved successfully!' };
};
exports.moveTask = moveTask;
const fetchColumnById = async (columnId) => {
    if (!mongoose_1.Types.ObjectId.isValid(columnId)) {
        throw new Error('Invalid column ID format');
    }
    const column = await columnModel_1.ColumnModel.findOne({ _id: new mongoose_1.Types.ObjectId(columnId) });
    if (!column) {
        throw new Error('Column not found');
    }
    return column;
};
exports.fetchColumnById = fetchColumnById;
const updateColumn = async (columnId, newInfoColumn) => {
    return await columnModel_1.ColumnModel.findByIdAndUpdate(columnId, newInfoColumn, { new: true });
};
exports.updateColumn = updateColumn;
const deleteColumnById = async (columnId) => {
    return columnModel_1.ColumnModel.findByIdAndDelete(columnId);
};
exports.deleteColumnById = deleteColumnById;
const updateColumnTitle = async (columnId, title) => {
    const column = await columnModel_1.ColumnModel.findById(columnId);
    if (!column) {
        return { success: false, message: 'Column not found!' };
    }
    column.title = title;
    await column.save();
    return { success: true, message: 'Column title updated successfully!' };
};
exports.updateColumnTitle = updateColumnTitle;
const reorderTasks = async (columnId, tasks) => {
    const updatedColumn = await columnModel_1.ColumnModel.findByIdAndUpdate(columnId, { tasks: tasks }, { new: true });
    if (!updatedColumn) {
        return ({ success: false, message: 'Column not found!' });
    }
    return ({ success: true, message: 'Tasks reordered succesfully!' });
};
exports.reorderTasks = reorderTasks;
const editTaskTitle = async (columnId, taskId, title, description) => {
    const column = await columnModel_1.ColumnModel.findById(columnId).populate('tasks');
    if (!column) {
        return { success: false, message: 'Column not found!' };
    }
    const task = column.tasks.find((task) => { var _a; return ((_a = task._id) === null || _a === void 0 ? void 0 : _a.toString()) === taskId; });
    if (!task) {
        return { success: false, message: 'Task not found!' };
    }
    if (title) {
        task.title = title;
    }
    if (description) {
        task.description = description;
    }
    await column.save();
    return { success: true, message: 'Task titled changed successfully!' };
};
exports.editTaskTitle = editTaskTitle;
const fetchTasksInColumn = async (columnId) => {
    if (!mongoose_1.Types.ObjectId.isValid(columnId)) {
        return { success: false, message: 'Invalid column ID format.' };
    }
    const column = await columnModel_1.ColumnModel.findOne({ _id: new mongoose_1.Types.ObjectId(columnId) });
    if (!column) {
        return { success: false, message: 'Column not found!' };
    }
    return { success: true, tasks: column.tasks };
};
exports.fetchTasksInColumn = fetchTasksInColumn;
const addTaskToColumn = async (columnId, newTask) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(columnId)) {
            return { success: false, message: 'Invalid column ID format' };
        }
        const columnObjectId = new mongoose_1.default.Types.ObjectId(columnId);
        const task = new taskModel_1.default({
            title: newTask.title,
            description: newTask.description
        });
        const savedTask = await task.save();
        if (!savedTask) {
            return { success: false, message: 'Task could not be saved. ' };
        }
        console.log('New task created: ', savedTask);
        const column = await columnModel_1.ColumnModel.findByIdAndUpdate(columnObjectId, { $push: { tasks: savedTask._id } }, { new: true });
        if (!column) {
            return { success: false, message: 'Column not found!' };
        }
        console.log('Task', savedTask, 'added to: ', column);
        return { success: true, message: 'Task inserted successfully!' };
    }
    catch (error) {
        console.error('Error inserting task: ', error);
        return { success: false, message: 'Error inserting task.' };
    }
};
exports.addTaskToColumn = addTaskToColumn;
const deleteTaskInColumn = async (columnId, taskId) => {
    const column = await columnModel_1.ColumnModel.findById(columnId);
    if (!column) {
        return { success: false, message: 'Column not found!' };
    }
    column.tasks = column.tasks.filter(task => { var _a; return ((_a = task._id) === null || _a === void 0 ? void 0 : _a.toString()) !== taskId; });
    await column.save();
};
exports.deleteTaskInColumn = deleteTaskInColumn;
