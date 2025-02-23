export type InvitationModel = Document & {
    _id: string;
    sender: string; 
    receiver: string;
    board: string; 
    status: string;
    createdAt: Date;
}

export default InvitationModel;
