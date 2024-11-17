import mongoose, { Schema, Document } from 'mongoose';
import { TaskModel } from './Task';

type Column = Document & {
    title: string;
    tasks: Task[];
}

const ColumnSchema: Schema = new Schema({
    title: { type: String, required: true, unique: true },
    tasks: { type: [TaskModel.schema], default: [] },
});

export const ColumnModel = mongoose.model<Column>('Column', ColumnSchema);

export default ColumnSchema;
