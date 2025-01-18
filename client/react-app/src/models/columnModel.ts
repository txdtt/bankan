import { TaskModel } from './taskModel';

export type ColumnModel = {
    _id: string;
    title: string;
    tasks: TaskModel[];
};

export default ColumnModel;
