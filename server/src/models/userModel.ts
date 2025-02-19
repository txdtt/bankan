import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type User = Document & {
    name: string;
    surname: string;
    username: string;
    email: string;
    password: string;
    boards: mongoose.Types.ObjectId[];
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema<User>({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true},
    password: { type: String, required: true },
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }]
});


userSchema.pre<User>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err: unknown) {
        next(err as Error);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
}

export const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;
