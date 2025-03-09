export type InviteModel = Document & {
    _id: string;
    sender: string; 
    receiver: string;
    board: string; 
    status: string;
}

export default InviteModel;
