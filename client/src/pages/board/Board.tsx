import { useParams } from "react-router-dom";
import ColumnsContainer from "../../components/columnsContainer/ColumnsContainer";
import { Socket } from 'socket.io-client';

const Board: React.FC<{
    socket: Socket;
}> = ({ socket }) => {
    const { boardId, boardTitle } = useParams();

    return (
        <>
            <h1>{boardTitle}</h1>
            <ColumnsContainer socket={socket} boardId={boardId || ""} />
        </>
    );
}

export default Board;
