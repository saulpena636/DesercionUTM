import styles from './css/login.module.css';
import React, { useState } from 'react';
import { Link } from "react-router-dom";

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Guardar token
                localStorage.setItem("token", data.access_token);

                // Opcional: guardar username
                localStorage.setItem("username", data.username);

                console.log("Login exitoso");

                // Redireccionar
                window.location.href = "/";

            } else {
                setError("Usuario o contraseña incorrectos");
            }
        } catch (err) {
            console.error(err);
            setError("Error al conectar con el servidor");
        }
    };

    return (
        <div className={styles.loginContainer}>
            <h1 className={styles.loginTitle}>DesercionUTM</h1>
            <div className={styles.loginForm}>
                <h2 className={styles.loginSubtitle}>Inicia sesión con tu usuario y contraseña</h2>
                <form className={styles.form} onSubmit={handleLogin}>
                    <input type="text" className={styles.loginInput} placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" className={styles.loginInput} placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" className={styles.loginButton}>Iniciar sesión</button>
                </form>
                <p>
                    ¿No tienes cuenta? <Link to="/register" style={{ color: '#7E2C2C' }}>Crear una cuenta</Link>
                </p>
            </div>
        </div>
    )
}

export default Login;