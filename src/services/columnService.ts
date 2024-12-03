import mongoose, { Types } from 'mongoose';
import { ColumnModel, Column } from '../models/columnModel';
import { Task } from '../models/taskModel';

export const createColumn = async (title: string, tasks: string[]): Promise<Column> => {
    const newColumn = new ColumnModel({ title, tasks });
    return await newColumn.save();
}

export const fetchColumns = async () => {
    return await ColumnModel.find();
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

    const sourceColumnObjectId = mongoose.Types.ObjectId.createFromHexString(sourceColumnId); 
    const targetColumnObjectId = mongoose.Types.ObjectId.createFromHexString(targetColumnId); 
    const taskObjectId = mongoose.Types.ObjectId.createFromHexString(taskId);

    const sourceColumn = await ColumnModel.findById(sourceColumnObjectId);

    if (!sourceColumn) {
        return { success: false, message: 'Source column not found!'};
    }

    const task = sourceColumn.tasks.find((t) => t._id?.toString() === taskObjectId.toString());

    if (!task) {
        return { success: false, message: 'Task not found in source column!' };
    }

    await ColumnModel.findByIdAndUpdate(
        sourceColumnObjectId,
        { $pull: { tasks: { _id: taskObjectId } } },
        { new: true }
    );

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

    await column.save();
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

    return column;
}

export const addTaskInColumn = async (columnId: string, newTask: Task):
    Promise<{ success: boolean, message: string }> => {
    const column = await ColumnModel.findByIdAndUpdate(
        columnId,
        { $push: { tasks: newTask } },
        { new: true }
    );

    if (!column) {
        return { success: false,  message: 'Column not found!' };
    }

    return { success: true, message: 'Task inserted successfully!'};
}

export const deleteTaskInColumn = async (columnId: string, taskId: string) => {
    const column = await ColumnModel.findById(columnId);

    if (!column) {
        return { success: false,  message: 'Column not found!' };
    }

    column.tasks = column.tasks.filter(task => task._id?.toString() !== taskId);

    await column.save();

}
