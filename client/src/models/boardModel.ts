import ColumnModel from "./columnModel";
import UserModel from "./userModel";

export type BoardModel = {
    _id: string;
    title: string;
    members: UserModel[];
    columns: ColumnModel[];  
};

export default BoardModel;
