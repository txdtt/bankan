import { Link } from "react-router-dom";

const Home = () => {
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
