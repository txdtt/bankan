import mongoose, { Schema, Document } from 'mongoose';

export type Board = Document & {
    title: string;
    members: mongoose.Types.ObjectId[];
    columnsContainer: mongoose.Types.ObjectId[];  
};

const BoardSchema: Schema = new Schema<Board>({
    title: { type: String, required: true, unique: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  
    columnsContainer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ColumnsContainer' }],  
});

export const BoardModel = mongoose.model<Board>('Board', BoardSchema);

export default BoardModel;
