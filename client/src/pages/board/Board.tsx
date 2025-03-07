import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../../components/socketContext/SocketContext';
import ColumnsContainer from '../../components/columnsContainer/ColumnsContainer';

const Board = () => {
    const { boardId, boardTitle } = useParams();
    const socket = useSocket();
    const [isConnecting, setIsConnecting] = useState(true);

    useEffect(() => {
        // Set a timeout to determine if socket connection is taking too long
        const timeoutId = setTimeout(() => {
            if (!socket) {
                setIsConnecting(false);
            }
        }, 5000);

        if (socket) {
            setIsConnecting(false);
            clearTimeout(timeoutId);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [socket]);

    if (isConnecting) {
        return <div>Connecting to server...</div>;
    }

    if (!socket) {
        return (
            <div>
                <h1>Connection Error</h1>
                <p>Could not connect to the server. Please check your internet connection and try again.</p>
                <button onClick={() => window.location.reload()}>Retry Connection</button>
            </div>
        );
    }

    return (
        <>
            <h1>{boardTitle}</h1>
            <ColumnsContainer socket={socket} boardId={boardId || ""} />
        </>
    );
};

export default Board;
