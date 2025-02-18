import React from "react";

const Login = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted!");
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Email:
                    <input type="email" name="email" required />
                </label>
            </div>
            <div>
                <label>
                    Senha:
                    <input type="password" name="password" required />
                </label>
            </div>
            <button type="submit">Entrar</button>
        </form>
    )
}

export default Login;
