import BoardModel from "../models/boardModel";

const url = 'http://localhost:3000/api/board';

export interface BoardResponse {
    success: boolean;
    message?: string;
    board?: BoardModel;
}

export async function createBoard(title: string, userId: string): Promise<BoardResponse> {
    try {
        const response = await fetch(`${url}/create-board`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({ title, userId })
        });

        const data: BoardResponse = await response.json(); 

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating user: ', error.message);
        }
        return { success: false, message: "An error occurred" }; 
    }
}
