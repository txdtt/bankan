import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../../services/userService';
import UserModel from '../../models/userModel';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles  from './ProfilePage.module.css'
import { createBoard } from '../../services/boardService';

const ProfilePage = () => {
    const [user, setUser] = useState<UserModel | null>(null);
    const [error, setError] = useState<string>('');

    const { username } = useParams();
    const navigate = useNavigate();
    const loggedInUser = localStorage.getItem('username');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('You are not logged in.');
            return;
        }

        const fetchProfile = async (token: string) => {
            try {
                const response = await fetchUserProfile(token);
                console.log("response: ", response);

                if (response.success) {
                    setUser(response.user || null);
                } else {
                    setError(response.message || 'An error occurred');
                }
            } catch (error) {
                setError('Error fetching user');
            }
        }

        fetchProfile(token);
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

        navigate(`/b/${response.board?._id}/${boardTitle}`)

        setShowDialog(false);
    }

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {user ?(
                <div>
                    <h1>Olá, {user.name} {user.surname}</h1>
                    <p>Email: {user.email}</p>
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
