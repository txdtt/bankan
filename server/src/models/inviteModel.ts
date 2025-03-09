import mongoose, { Schema, Document } from 'mongoose';

export type Invite = Document & {
    sender: string; 
    receiver: string;
    board: mongoose.Types.ObjectId; 
};

const InviteSchema: Schema = new Schema<Invite>({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    board: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Board' },  
});

export const InviteModel = mongoose.model<Invite>('Invite', InviteSchema);

export default InviteModel;
