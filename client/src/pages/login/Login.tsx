import React, { useState } from "react";
import { authenticateUser } from "../../services/userService";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const response = await authenticateUser(email, password);

        if (!response.success) {
            setError(response.message || "Login failed, please try again.");
        } else if (response.token){
            localStorage.setItem("token", response.token);

            if (response.user) {
                localStorage.setItem("username", response.user?.username);
                const username = response.user.username;
                console.log("username: ", username);
                navigate(`/u/${username}`);
            } else {
                setError(response.message || "Login failed, please try again.");
            }
        }

    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input type="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div>
                <label>Senha:</label>
                <input type="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit">Entrar</button>
        </form>
    )
}

export default Login;
