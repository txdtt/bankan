import ColumnsContainerModel from "./columnsContainerModel";
import UserModel from "./userModel";

export type BoardModel = {
    _id: string;
    title: string;
    members: UserModel[];
    columnsContainer: ColumnsContainerModel;  
};

export default BoardModel;
