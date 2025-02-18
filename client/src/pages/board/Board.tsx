import ColumnsContainer from "../../components/columnsContainer/ColumnsContainer";
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log(`Connected with socket ID: ${socket.id}`)
})

const Board = () => {
    return (
        <>
            <ColumnsContainer socket={socket}/>
        </>
    )
}

export default Board;
