import { useParams } from "react-router-dom";
import ColumnsContainer from "../../components/columnsContainer/ColumnsContainer";
import { io } from 'socket.io-client';

const Board = () => {
    const socket = io('http://localhost:3000');

    const { boardId, boardTitle } = useParams();

    return (
        <>
            <h1>{boardTitle}</h1>
            <ColumnsContainer socket={socket} boardId={boardId || ""} />
        </>
    );
}

export default Board;
