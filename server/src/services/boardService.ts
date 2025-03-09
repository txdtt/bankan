import { Types } from 'mongoose';
import BoardModel from "../models/boardModel.js"
import { ColumnModel, Column } from '../models/columnModel.js';
import UserModel from '../models/userModel.js';
import InviteModel from '../models/inviteModel.js';

export const createBoard = async (title: string, userId: string) => {
    const newBoard = new BoardModel({ title: title, members: [userId], columnsContainer: []}) ;

    return await newBoard.save();
}

export const insertBoardInUser = async (userId: string, boardId: string) => {
    const ObjectIdUserId = new Types.ObjectId(userId)
    const user = await UserModel.findById(ObjectIdUserId);

    if (!user) {
        throw new Error("User not found");
    }
    
    const boardExists = user.boards.some(board => board.toString() === boardId);

    if (boardExists) {
        return { success: false, message: "User is already a member of this board!" };
    }

    const objectIdBoardId = new Types.ObjectId(boardId);

    user.boards.push(objectIdBoardId);

    await user.save();

    const board = await BoardModel.findById(objectIdBoardId);

    if (!board) {
        return { success: false, message: "Board not found!" };
    }

    board.members.push(ObjectIdUserId);

    return await user.save();
}

export const deleteBoard = async (boardId: string) => {
    return BoardModel.findByIdAndDelete(boardId);
}

export const getColumns = async (boardId: string) => {
    const ObjectIdBoardId = new Types.ObjectId(boardId);
    return await ColumnModel.find({ boardId: ObjectIdBoardId});
}

export const createColumn = async (title: string, boardId: string): Promise<Column> => {
    const ObjectIdBoardId = new Types.ObjectId(boardId);

    const newColumn = new ColumnModel({ title, tasks: [], boardId: ObjectIdBoardId });
    const board = await BoardModel.findById(ObjectIdBoardId);

    if (board) {
        board.columns.push(ObjectIdBoardId);
        await board.save();
    }

    return await newColumn.save();
}

export const deleteColumnById = async (columnId: string) => {
    return ColumnModel.findByIdAndDelete(columnId);
}

export const updateColumnTitle = async (columnId: string, title: string
): Promise<{ success: boolean, message: string }> => {

    const column = await ColumnModel.findById(columnId);

    if (!column) {
        return {success: false, message: 'Column not found!' };
    }

    column.title = title;

    await column.save();

    return { success: true, message: 'Column title updated successfully!' };
}

export const inviteUser = async (boardId: string, senderEmail: string, receiverEmail: string) => {
    try {
        if (!Types.ObjectId.isValid(boardId)) {
            return { success: false, message: "Invalid board ID format!" };
        }

        const objectIdBoardId = new Types.ObjectId(boardId);

        const newInvite = new InviteModel({ sender: senderEmail, receiver: receiverEmail, board: objectIdBoardId });

        const receiverUser = await UserModel.findOne({ email: receiverEmail });

        if (!receiverUser) {
            return { success: false, message: "User not found!" };
        }

        await newInvite.save();

        receiverUser.invites.push(newInvite._id as Types.ObjectId);

        await receiverUser.save();

        return { success: true, message: "Invitation sent successfully!" };
    } catch (error) {
        console.error("Error inviting user:", error);
        return { success: false, message: "An error occurred while inviting the user." };
    }
}

export const fetchUserInvites = async (userId: string) => {
    try {
        const objectIdUserId= new Types.ObjectId(userId);

        const user = await UserModel.findById(objectIdUserId);

        if (!user) {
            return { success: false, message: "User not found!" };
        }

        const invites = await InviteModel.find({
            _id: { $in: user.invites },
        }).populate('board');

        const formattedInvites = invites.map(invite => ({
            _id: invite._id,
            sender: invite.sender,
            receiver: invite.receiver,
            board: invite.board
        }));

        return ({ success: true, invites: formattedInvites });
    } catch (error) {
        console.error("Error fetching user invites:", error);
        return { success: false, message: "An error occurred while fetching user invites." };
    }
}

export const acceptInvite = async (inviteId: string) => {
    try {
        const objectIdInviteId= new Types.ObjectId(inviteId);

        const invite = await InviteModel.findById(objectIdInviteId);

        if (!invite) {
            return { success: false, message: "Invite not found!" };
        }

        const user = await UserModel.findOne({ email: invite.receiver });

        if (!user) {
            return { success: false, message: "User not found!" };
        }

        await UserModel.findByIdAndUpdate(
            user._id,
            { $addToSet: { boards: invite.board }}
        );

        await insertBoardInUser(user._id as string, invite.board.toString())

        await UserModel.findByIdAndUpdate(
            user._id,
            { $pull: { invites: inviteId }}
        );

        return { success: true, message: "Invite accepted!" };
    } catch (error) {
        console.error("Error accepting invite:", error);
        return { success: false, message: "An error occurred while accepting the invite." };
    }
}
