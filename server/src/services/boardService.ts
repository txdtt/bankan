import BoardModel from "../models/boardModel.js"

export const createBoard = async (title: string, userId: string) => {
    const newBoard = new BoardModel({ title: title, members: [userId], columnsContainer: []}) ;

    return await newBoard.save();
}
