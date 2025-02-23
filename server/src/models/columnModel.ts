import mongoose, { Schema, Document } from 'mongoose';

export type Column = Document & {
    title: string;
    tasks: mongoose.Types.ObjectId[];  
    boardId: mongoose.Types.ObjectId;
};

const ColumnSchema: Schema = new Schema<Column>({
    title: { type: String, required: true, unique: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],  
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board'},
});

export const ColumnModel = mongoose.model<Column>('Column', ColumnSchema);

export default ColumnModel;
