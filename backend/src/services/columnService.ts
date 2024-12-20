import { Types } from 'mongoose';
import { Task } from '../models/taskModel.js';
import { ColumnModel, Column } from '../models/columnModel.js';

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

    await updatedColumn.save();

    return ({ success: true,  message: 'Tasks reordered succesfully!' });
}
