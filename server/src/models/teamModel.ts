import mongoose, { Schema, Document } from 'mongoose';

export type Member = Document & {
    userId: mongoose.Types.ObjectId;
    role: string
}

export type Team = Document & {
    name: string;
    members: mongoose.Types.ObjectId[];
};

const MemberSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, required: true }
})

const TeamSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    members: [MemberSchema],  
});

export const TeamModel = mongoose.model<Team>('Team', TeamSchema);

export default TeamModel;
