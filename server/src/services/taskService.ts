import mongoose, { Types } from 'mongoose';
import TaskModel, { Task } from '../models/taskModel.js';
import { ColumnModel } from '../models/columnModel.js';

export const moveTask = async (
    sourceColumnId: string,
    targetColumnId: string,
    taskId: string
): Promise<{ success: boolean, message: string }> => {
    if (!mongoose.Types.ObjectId.isValid(sourceColumnId) || 
        !mongoose.Types.ObjectId.isValid(targetColumnId) || 
        !mongoose.Types.ObjectId.isValid(taskId)) {
        return { success: false, message: 'Invalid ObjectId(s) provided' };
    }

    const sourceColumnObjectId = new mongoose.Types.ObjectId(sourceColumnId); 
    const targetColumnObjectId = new mongoose.Types.ObjectId(targetColumnId); 

    const sourceColumn = await ColumnModel.findById(sourceColumnObjectId);

    if (!sourceColumn) {
        return { success: false, message: 'Source column not found!'};
    }

    const taskToBeMoved = sourceColumn.tasks.find((task) => task._id.toString() === taskId);

    if (!taskToBeMoved) {
        return { success: false, message: 'Task not found in source column!' };
    }

    deleteTaskInColumn(sourceColumnId, taskId);

    const targetColumn = await ColumnModel.findByIdAndUpdate(
        targetColumnObjectId,
        { $push: { tasks: taskToBeMoved } },
        { new: true }
    );

    if (!targetColumn) {
        return { success: false, message: 'Target column not found!' };
    }

    await targetColumn.save();

    return { success: true, message: 'Task moved successfully!' };
}

export const editTaskTitle = async (
    columnId: string, 
    taskId: string,
    title?: string,
    description?: string
):Promise<{ success: boolean, message: string }> => {
    const column = await ColumnModel.findById(columnId).populate<{ tasks: Task[] }>('tasks');

    if (!column) {
        return { success: false, message: 'Column not found!'};
    }

    const taskToBeUpdated = column.tasks.find((task: Task) => task._id?.toString() === taskId);

    if (!taskToBeUpdated) {
        return { success: false, message: 'Task not found!'};
    }

    if (title) {
        taskToBeUpdated.title = title;
    }

    if (description) {
        taskToBeUpdated.description = description;
    }

    await taskToBeUpdated.save();

    return { success: true, message: 'Task titled changed successfully!'};
}

export const fetchTasksInColumn = async (columnId: string) => {
    if (!Types.ObjectId.isValid(columnId)) {
            return { success: false,  message: 'Invalid column ID format.' };
        }

    const column = await ColumnModel.findOne({ _id: new Types.ObjectId(columnId) });

    if (!column) {
        return { success: false,  message: 'Column not found!' };
    }

    return { success: true, tasks: column.tasks };
}

export const addTaskToColumn = async (columnId: string, newTask: Task
):Promise<{ success: boolean, message: string }> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(columnId)) {
            return { success: false, message: 'Invalid column ID format' };
        }

        const columnObjectId = new mongoose.Types.ObjectId(columnId);

        const task = new TaskModel({
            title: newTask.title,
            description: newTask.description
        });

        const savedTask = await task.save();

        if (!savedTask) {
            return { success: false, message: 'Task could not be saved. '};
        }

        console.log('New task created: ', savedTask);

        const column = await ColumnModel.findByIdAndUpdate(
            columnObjectId,
            { $push: { tasks: savedTask._id } },
            { new: true }
        );

        if (!column) {
            return { success: false, message: 'Column not found!' };
        }

        await column.save();

        return { success: true, message: 'Task inserted successfully!' };
    } catch (error) {
        console.error('Error inserting task: ', error);
        return { success: false, message: 'Error inserting task.' };
    }
}

export const deleteTaskInColumn = async (columnId: string, taskId: string) => {
    const column = await ColumnModel.findById(columnId);

    if (!column) {
        return { success: false,  message: 'Column not found!' };
    }

    column.tasks = column.tasks.filter(task => task._id?.toString() !== taskId);

    await column.save();

    return { success: true, message: 'Task deleted successfully!' };
}
