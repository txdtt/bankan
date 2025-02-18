import mongoose, { Schema, Document } from 'mongoose';

export type User = Document & {
    name: string;
    email: string;
    password: string;
    boards: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }]
});

export const UserModel = mongoose.model<User>('User', UserSchema);

export default UserModel;
