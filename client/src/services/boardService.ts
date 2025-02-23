import BoardModel from "../models/boardModel";
import ColumnModel from "../models/columnModel";

const url = 'http://localhost:3000/api/board';

export interface BoardResponse {
    success: boolean;
    board?: BoardModel;
    message?: string;
}

export async function createBoard(title: string, userId: string): Promise<BoardResponse> {
    try {
        const response = await fetch(`${url}/create-board`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({ title, userId })
        });

        const data: BoardModel = await response.json(); 

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        return {success: true, board: data };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating user: ', error.message);
        }
        return { success: false, message: "An error occurred" }; 
    }
}

export async function insertBoardInUser(userId: string, boardId: string) {
    try {
        const response = await fetch(`${url}/insert-board-in-user`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({ userId, boardId })
        });

        const data: BoardModel = await response.json(); 

        console.log('inserBoardInUser response: ', data);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error inserting board in user: ', error.message);
        }
        return { success: false, message: "An error occurred" }; 
    }
}

export async function getColumns(boardId: string): Promise<ColumnModel[]> {
    try {
        const response = await fetch(`${url}/${boardId}/get-columns`, {
            method: 'GET',
            headers: {'Content-type': 'application/json'},
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data: ColumnModel[] = await response.json();

        console.log('data (getColumns): ', data);

        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } 
        return [];
    }
}

export async function postColumn(title: string, boardId: string) {
    console.log('boardId: ', boardId);
    try {
        const response = await fetch(`${url}/${boardId}/add-column`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ title, boardId })
        });

        const data = await response.json();

        console.log('postColumn: ', data);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error posting column: ', error.message);
        }
    }
}

export async function deleteColumnById(columnId: string, boardId: string) {
    try {
        const response = await fetch(`${url}/${boardId}/${columnId}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
        })

        if (!response.ok) {
            console.error(`Error deleting column: ${response.status}`);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error);
        }
    }
}

export const sendInvite = async (emailSender: string, emailReceiver: string, boardId: string) => {
    const response = await fetch(`${url}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailSender, emailReceiver, boardId }),
    });
    
    const data = await response.json();
    console.log('Invite sent:', data);
};
