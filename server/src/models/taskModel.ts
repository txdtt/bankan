import mongoose, { Schema, Document } from 'mongoose';

export type Task = Document & {
    title: string;
    description: string;
}

const TaskSchema: Schema = new Schema<Task>({
    title: { type: String, required: true },
    description: { type: String, required: true },
});

export const TaskModel = mongoose.model<Task>('Task', TaskSchema);

export default TaskModel;
