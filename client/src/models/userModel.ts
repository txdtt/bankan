import { BoardModel } from './boardModel';

export type UserModel = {
    _id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    boards: BoardModel[];
};

export default UserModel;
