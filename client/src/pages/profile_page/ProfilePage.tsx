import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../../services/userService';
import UserModel from '../../models/userModel';
//import BoardModel from '../../models/boardModel';

const ProfilePage = () => {
    const [user, setUser] = useState<UserModel | null>(null);
    const [error, setError] = useState<string>('');

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

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {user ?(
                <div>
                    <h1>Olá, {user.name} {user.surname}</h1>
                    <p>Email: {user.email}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default ProfilePage;
