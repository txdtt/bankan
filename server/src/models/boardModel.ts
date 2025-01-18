import mongoose, { Schema, Document } from 'mongoose';

export type Board = Document & {
    title: string;
    teams: mongoose.Types.ObjectId[];
    columns: mongoose.Types.ObjectId[];  
};

const BoardSchema: Schema = new Schema({
    title: { type: String, required: true, unique: true },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],  
    columns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }],  
});

export const BoardModel = mongoose.model<Board>('Board', BoardSchema);

export default BoardModel;
