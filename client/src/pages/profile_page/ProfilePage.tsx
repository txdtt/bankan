import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../../services/userService';
import UserModel from '../../models/userModel';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles  from './ProfilePage.module.css'
import { acceptInvite, createBoard, fetchUserInvites, insertBoardInUser } from '../../services/boardService';
import InviteModel from '../../models/inviteModel';

const ProfilePage = () => {
    const [user, setUser] = useState<UserModel | null>(null);
    const [error, setError] = useState<string>('');
    const [invites, setInvites] = useState<InviteModel[]>([]);

    const { username } = useParams();
    const navigate = useNavigate();
    const loggedInUser = localStorage.getItem('username');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You are not logged in.');
            return;
        }
        
        const fetchData = async (token: string) => {
            try {
                const userResponse = await fetchUserProfile(token);
                if (userResponse.success) {
                    setUser(userResponse.user || null);
                    console.log(userResponse.user);
                    
                    if (userResponse.user) {
                        const invitesResponse = await fetchUserInvites(token, userResponse.user._id);
                        if (invitesResponse.success) {
                            console.log(invitesResponse);
                            setInvites(invitesResponse.invites || []);
                        } else {
                            setError(invitesResponse.message || 'Error fetching invites');
                            console.error('Error fetching invites: ', invitesResponse.message);
                        }
                    }
                } else {
                    setError(userResponse.message || 'An error occurred');
                }
            } catch (error) {
                setError('Error fetching user');
                console.error(error);
            } 
        }
        
        fetchData(token);
    }, [])

    useEffect(() => {
        if (username && loggedInUser && username !== loggedInUser) {
            navigate(`/u/${loggedInUser}`);
        }
    }, [username, loggedInUser, navigate]);

    const signOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    }

    const [showDialog, setShowDialog] = useState(false);
    const [boardTitle, setBoardTitle] = useState("");

    const handleBoardSubmit = async (userId: string) => {
        const response = await createBoard(boardTitle, userId);

        if (!response.success) {
            setError(response.message || "Board creation failed, please try again.");
        }

        if (response.board?._id) {
            const toBoardId = response.board._id;
            await insertBoardInUser(userId, response.board._id);
            navigate(`/b/${toBoardId}/${boardTitle}`)
        }

        setShowDialog(false);
    }

    const handleAcceptInvite = async (inviteId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !user) return;

            const response = await acceptInvite(token, inviteId);
            if (response.success) {
                // Refresh invites and user data after accepting
                const userResponse = await fetchUserProfile(token);
                const invitesResponse = await fetchUserInvites(token, user._id);
                
                if (userResponse.success) setUser(userResponse.user || null);
                if (invitesResponse.success) setInvites(invitesResponse.invites || []);
            } else {
                setError(response.message || "Failed to accept invite");
            }
        } catch (error) {
            console.error("Error accepting invite:", error);
            setError("Failed to accept invite. Please try again.");
        }
    }

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {user ?(
                <div>
                    <h1>Olá, {user.name} {user.surname}</h1>
                    {invites.length > 0 && (
                        <div className={styles.invitesSection}>
                            <h2>Convites Pendentes</h2>
                            <ul className={styles.invitesList}>
                                {invites.map((invite) => (
                                    <li key={invite._id} className={styles.inviteItem}>
                                        <div className={styles.inviteInfo}>
                                            <span>{invite.sender} convidou você para um quadro</span>
                                        </div>
                                        <div className={styles.inviteActions}>
                                            <button 
                                                className={styles.acceptButton}
                                                onClick={() => handleAcceptInvite(invite._id)}
                                            >
                                                Aceitar
                                            </button>
                                            {/*
                                            <button 
                                                className={styles.declineButton}
                                                onClick={() => handleDeclineInvite(invite._id)}
                                            >
                                                Recusar
                                            </button>
                                            */}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <ul>
                        {user.boards.map((board) => (
                            <li key={board._id}>
                                <Link to={`/b/${board._id}/${board.title}`}>{board.title}</Link>
                            </li>                        
                        ))} 
                    </ul>
                    <button onClick={() => setShowDialog(true)}>Criar novo quadro</button>
                    <button onClick={signOut}>Sair</button>

                    {showDialog && (
                        <div className={styles.dialogOverlay}>
                            <div className={styles.dialog}>
                                <h3>Nome do quadro</h3> 
                                <input 
                                    type="text"
                                    value={boardTitle}
                                    onChange={(e) => setBoardTitle(e.target.value)}
                                    placeholder="Digite o nome do quadro"
                                />
                                <button onClick={() => handleBoardSubmit(user._id)} disabled={!boardTitle.trim()}>
                                    Criar 
                                </button>
                                <button onClick={() => setShowDialog(false)}>Cancelar</button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default ProfilePage;
