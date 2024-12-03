import mongoose, { Schema } from 'mongoose';
import { TaskModel } from './TaskSchema';
const ColumnSchema = new Schema({
    title: { type: String, required: true, unique: true },
    tasks: { type: [TaskModel.schema], default: [] },
});
export const ColumnModel = mongoose.model('Column', ColumnSchema);
export default ColumnSchema;
