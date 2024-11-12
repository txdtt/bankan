import mongose, {Schema, Document} from 'mongoose';

type Task = Document & {
    title: string;
    description: string;
}

const TaskSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
});

export const TaskModel = mongose.model<Task>('Task', TaskSchema);
