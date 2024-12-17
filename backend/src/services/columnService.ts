import mongoose, { mongo, Types } from 'mongoose';
import TaskModel, { Task } from '../models/taskModel';
import { ColumnModel, Column } from '../models/columnModel';
import { describe } from 'node:test';

export const fetchColumns = async () => {
    return await ColumnModel.find().populate('tasks');
}

export const createColumn = async (title: string): Promise<Column> => {
    const newColumn = new ColumnModel({ title, tasks: [] });
    return await newColumn.save();
}

export const deleteColumns = async () => {
    return await ColumnModel.deleteMany({});
}

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
    const taskObjectId = new mongoose.Types.ObjectId(taskId);

    const sourceColumn = await ColumnModel.findById(sourceColumnObjectId);

    if (!sourceColumn) {
        return { success: false, message: 'Source column not found!'};
    }

    const task = sourceColumn.tasks.find((t) => t._id.toString() === taskId);

    if (!task) {
        return { success: false, message: 'Task not found in source column!' };
    }

    deleteTaskInColumn(sourceColumnId, taskId);

    /*
    await ColumnModel.findByIdAndUpdate(
        sourceColumnObjectId,
        { $pull: { tasks: { _id: taskObjectId } } },
        { new: true }
    );
    */

    const targetColumn = await ColumnModel.findByIdAndUpdate(
        targetColumnObjectId,
        { $push: { tasks: task } },
        { new: true }
    );

    if (!targetColumn) {
        return { success: false, message: 'Target column not found!' };
    }

    return { success: true, message: 'Task moved successfully!' };
}

export const fetchColumnById = async (columnId: string) => {
    if (!Types.ObjectId.isValid(columnId)) {
        throw new Error('Invalid column ID format');
    }

    const column = await ColumnModel.findOne({ _id: new Types.ObjectId(columnId) });

    if (!column) {
        throw new Error('Column not found');
    }

    return column;
}

export const updateColumn = async (columnId: string, newInfoColumn: Column) => {
    return await ColumnModel.findByIdAndUpdate(columnId, newInfoColumn, { new: true });
}

export const deleteColumnById = async (columnId: string) => {
    return ColumnModel.findByIdAndDelete(columnId);
}

export const updateColumnTitle = async (columnId: string, title: string): 
    Promise<{ success: boolean, message: string }> => {

    const column = await ColumnModel.findById(columnId);

    if (!column) {
        return {success: false, message: 'Column not found!' };
    }

    column.title = title;

    await column.save();

    return { success: true, message: 'Column title updated successfully!' };
}

export const reorderTasks = async (columnId: string, tasks: Task[]):
    Promise<{ success: boolean, message: string }> => {

    const updatedColumn = await ColumnModel.findByIdAndUpdate(
            columnId,
            { tasks: tasks },
            { new: true }
        );

    if (!updatedColumn) {
        return ({ success: false,  message: 'Column not found!' });
    }

    return ({ success: true,  message: 'Tasks reordered succesfully!' });
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

    const task = column.tasks.find((task: Task) => task._id?.toString() === taskId);

    if (!task) {
        return { success: false, message: 'Task not found!'};
    }

    if (title) {
        task.title = title;
    }

    if (description) {
        task.description = description;
    }

    await task.save();
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

        console.log('Task', savedTask, 'added to: ', column);

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

}
