import mongoose, { Schema, Document } from 'mongoose';

export type Invite = Document & {
    sender: mongoose.Types.ObjectId; 
    receiver: mongoose.Types.ObjectId;
    board: mongoose.Types.ObjectId; 
    status: string;
};

const InviteSchema: Schema = new Schema<Invite>({
    sender: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }],  
    receiver: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }],  
    board: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'board' }],  
    status: { type: String, required: true },
});

export const InviteModel = mongoose.model<Invite>('Invite', InviteSchema);

export default InviteModel;
