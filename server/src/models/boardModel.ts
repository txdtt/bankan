import mongoose, { Schema, Document } from 'mongoose';

export type Board = Document & {
    title: string;
    members: mongoose.Types.ObjectId[];
    columns: mongoose.Types.ObjectId[];  
};

const BoardSchema: Schema = new Schema({
    title: { type: String, required: true, unique: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  
    columns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }],  
});

export const BoardModel = mongoose.model<Board>('Board', BoardSchema);

export default BoardModel;
