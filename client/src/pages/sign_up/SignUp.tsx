import { useState } from "react";

const SignUp = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setError("")
        console.log("Form submitted!");
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Nome:
                    <input type="text" name="name" required />
                </label>
            </div>
            <div>
                <label>
                    Sobrenome:
                    <input type="text" name="surname" required />
                </label>
            </div>
            <div>
                <label>
                    Email:
                    <input type="email" name="email" required />
                </label>
            </div>
            <div>
                <label>
                    Senha:
                    <input 
                        type="password" 
                        name="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Insira a senha novamente:
                    <input 
                        type="password" 
                        name="password" 
                        required 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </label>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit">Cadastrar</button>
        </form>
    )
}

export default SignUp;
