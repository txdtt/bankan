import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        if (token && username) {
            navigate(`/u/${username}`);
        }
    }, [navigate]);

    return (
        <div>
            <h1>Bankan</h1>
            <Link to="/login">
                <button>Login</button> 
            </Link>
            <Link to="/signup">
                <button>Criar conta</button> 
            </Link>
        </div>
    )
}

export default Home;
