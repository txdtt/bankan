import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../../components/socketContext/SocketContext';
import ColumnsContainer from '../../components/columnsContainer/ColumnsContainer';
import styles from './Board.module.css';
import { inviteUserToBoard } from '../../services/boardService';
import { jwtDecode, JwtPayload } from 'jwt-decode'

interface UserJwtPayload extends JwtPayload {
    email?: string;
}

const Board = () => {
    // All hooks must be at the top level and always called in the same order
    const { boardId, boardTitle } = useParams();
    const socket = useSocket();
    const [isConnecting, setIsConnecting] = useState(true);
    const [currentUserEmail, setCurrentUserEmail] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    
    // Decode token on component mount (once)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode<UserJwtPayload>(token);
                console.log('decoded.email: ', decoded.email);
                setCurrentUserEmail(decoded.email || decoded.sub || '');
            } catch (error) {
                console.error('Error decoding token: ', error);
            }
        }
    }, []); // Empty dependency array means this runs once on mount
    
    // Handle socket connection separately
    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        
        if (!socket) {
            // Set timeout to detect connection issues
            timeoutId = setTimeout(() => {
                setIsConnecting(false);
            }, 5000);
        } else {
            setIsConnecting(false);
        }
        
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [socket]);
    
    // Define handleInviteSubmit with useCallback to maintain reference stability
    const handleInviteSubmit = useCallback(async () => {
        if (boardId && currentUserEmail) {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await inviteUserToBoard(token, boardId, currentUserEmail, inviteEmail);
                    setShowDialog(false);
                } catch (error) {
                    console.error('Error inviting user:', error);
                }
            }
        }
    }, [boardId, currentUserEmail, inviteEmail]);
    
    const openDialog = useCallback(() => {
        setShowDialog(true);
    }, []);
    
    const closeDialog = useCallback(() => {
        setShowDialog(false);
    }, []);
    
    // Render loading state
    if (isConnecting) {
        return <div>Connecting to server...</div>;
    }
    
    // Render error state
    if (!socket) {
        return (
            <div>
                <h1>Connection Error</h1>
                <p>Could not connect to the server. Please check your internet connection and try again.</p>
            </div>
        );
    }
    
    // Main render
    return (
        <>
            <h1>{boardTitle}</h1>
            <button onClick={openDialog}>Convidar</button>
            {showDialog && (
                <div className={styles.dialogOverlay}>
                    <div className={styles.dialog}>
                        <h3>Email do convidado</h3> 
                        <input 
                            type="text"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="Digite o email do convidado"
                        />
                        <button onClick={handleInviteSubmit}>
                            Convidar 
                        </button>
                        <button onClick={closeDialog}>Cancelar</button>
                    </div>
                </div>
            )}
            <ColumnsContainer socket={socket} boardId={boardId || ""} />
        </>
    );
};

export default Board;
