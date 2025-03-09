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

export async function inviteUserToBoard(token: string, boardId: string, senderEmail: string, receiverEmail: string) {
    try {
        const response = await fetch(`${url}/${boardId}/invite`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                senderEmail,
                receiverEmail
            })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error inviting user:', error);
        return { success: false, message: 'Failed to send invitation' };
    }
}


export async function fetchUserInvites(token: string, userId: string) {
    try {
        const response = await fetch(`${url}/invites/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching invites:', error);
        return { success: false, message: 'Failed to fetch invites' };
    }
}

export const acceptInvite = async (token: string, inviteId: string) => {
    try {
        const response = await fetch(`${url}/invites/${inviteId}/accept`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error accepting invite:', error);
        return { success: false, message: 'Failed to accept invite' };
    }
};

// Decline an invite
export const declineInvite = async (token: string, inviteId: string) => {
    try {
        const response = await fetch(`${url}/invites/${inviteId}/decline`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
      
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error declining invite:', error);
        return { success: false, message: 'Failed to decline invite' };
    }
};
