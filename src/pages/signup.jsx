import styles from './css/login.module.css';
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Nuevo estado
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        // Validación: Verificar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return; // Detiene la ejecución para no hacer la petición al backend
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL}/register`, {
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

            if (response.status === 201 && data.success) {
                setSuccessMsg("¡Usuario creado exitosamente! Redirigiendo al login...");
                
                setTimeout(() => {
                    navigate("/login");
                }, 2000);

            } else {
                setError(data.error || "Error al registrar el usuario");
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
                <h2 className={styles.loginSubtitle}>Crea una nueva cuenta de profesor</h2>
                
                <form className={styles.form} onSubmit={handleSignup}>
                    <input 
                        type="text" 
                        className={styles.loginInput} 
                        placeholder="Nombre de usuario" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                    />
                    <input 
                        type="password" 
                        className={styles.loginInput} 
                        placeholder="Contraseña" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                    {/* Nuevo input para confirmar contraseña */}
                    <input 
                        type="password" 
                        className={styles.loginInput} 
                        placeholder="Ingresar nuevamente la contraseña" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required
                    />
                    
                    {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
                    {successMsg && <p style={{ color: 'green', fontSize: '0.9rem' }}>{successMsg}</p>}

                    <button type="submit" className={styles.loginButton}>Registrarse</button>
                </form>

                <p>
                    ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#7E2C2C' }}>Inicia sesión aquí</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;