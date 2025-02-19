import { useState } from "react";
import { createUser } from "../../services/userService";
import UserModel from "../../models/userModel";

const SignUp = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setError("");

        const newUser: UserModel = {
            _id: "", 
            name,
            surname,
            email,
            password,
            boards: [],
        };

        createUser(newUser);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Nome:
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
                </label>
            </div>
            <div>
                <label>
                    Sobrenome:
                    <input type="text" required value={surname} onChange={(e) => setSurname(e.target.value)} />
                </label>
            </div>
            <div>
                <label>
                    Email:
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
            </div>
            <div>
                <label>
                    Senha:
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
            </div>
            <div>
                <label>
                    Insira a senha novamente:
                    <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </label>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit">Cadastrar</button>
        </form>
    );
};

export default SignUp;
