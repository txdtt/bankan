import mongoose, { Schema, Document } from 'mongoose';
import { TaskModel } from './taskModel.js';

export type Column = Document & {
    title: string;
    tasks: mongoose.Types.ObjectId[];  
};

const ColumnSchema: Schema = new Schema({
    title: { type: String, required: true, unique: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],  
});

export const ColumnModel = mongoose.model<Column>('Column', ColumnSchema);

export default ColumnModel;
