import mongoose, { Schema, Document } from 'mongoose';

export type ColumnsContainer = Document & {
    columns: mongoose.Types.ObjectId[];  
};

const ColumnsContainerSchema: Schema = new Schema<ColumnsContainer>({
    columns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }],  
});

export const ColumnsContainerModel = mongoose.model<ColumnsContainer>('ColumnsContainer', ColumnsContainerSchema);

export default ColumnsContainerModel;
