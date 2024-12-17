import { Task } from './taskModel';

export type Column = {
    _id?: string;
    title: string;
    tasks: Task[];
};

export let columns: Column[] = [];
