import { NavLink, useNavigate } from "react-router-dom"; // Importamos useNavigate
import React, { useState, useEffect } from 'react';
import styles from './css/navbar.module.css';

function Navegacion() {
    // Inicializamos navigate
    const navigate = useNavigate();

    // Estado para controlar si el menú móvil está abierto
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    // Función para alternar el estado
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Función para cambiar de modo
    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    // Función para cerrar sesión
    const handleLogout = () => {
        // 1. Limpiar los datos de sesión almacenados
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        
        // 2. Cerrar el sidebar si está en versión móvil (opcional pero recomendado)
        setIsSidebarOpen(false);

        // 3. Redirigir a la pantalla de login
        navigate("/login");
    };

    return (
        <>
            <div className={styles.mobileHeader}>
                <button onClick={toggleSidebar} className={styles.menuButton}>
                    ☰ {/* Puedes usar un icono de react-icons aquí */}
                </button>
                <h3 style={{ margin: 0}}>DeserciónUTM</h3>

            </div>

            {/* OVERLAY: Fondo oscuro para cerrar al hacer clic afuera (Solo móvil) */}
            {isSidebarOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <nav className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                {/* Botón de cerrar "X" (Solo visible en móvil) */}
                <button
                    className={styles.closeButton}
                    onClick={() => setIsSidebarOpen(false)}
                >
                    ✕
                </button>
                <div className={styles.mainnav}>
                    <div className={styles.titlenav}>
                        DeserciónUTM
                    </div>
                    <ul className={styles.navlist}>
                        <li><NavLink to="/" className={({ isActive }) => isActive ? styles.active : ""}><i className="fas fa-square-poll-vertical"></i>Panel principal</NavLink></li>
                        <li><NavLink to="/estudiantes" className={({ isActive }) => isActive ? styles.active : ""}><i className="fas fa-user-graduate"></i>Estudiantes en riesgo</NavLink></li>
                        <li><NavLink to="/perfil" className={({ isActive }) => isActive ? styles.active : ""}><i className="fas fa-graduation-cap"></i>Buscar Estudiante</NavLink></li>
                        <li><NavLink to="/upload" className={({ isActive }) => isActive ? styles.active : ""}><i className="fas fa-file"></i>Subir Datos</NavLink></li>
                    </ul>
                    
                    {/* Contenedor inferior para botones adicionales */}
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <p>Usuario: {localStorage.getItem("username")}</p>
                        
                        {/* Botón de Cerrar Sesión */}
                        <button onClick={handleLogout} className={styles.themeToggleBtnEscritorio}>
                            <i className="fas fa-sign-out-alt"></i> Cerrar sesión
                        </button>

                        {/* Botón de Modo Oscuro */}
                        <button onClick={toggleTheme} className={styles.themeToggleBtnEscritorio}>
                            {isDarkMode ? <><i className="fas fa-sun"></i>{' Modo Claro'}</> : <><i className="fas fa-moon"></i>{' Modo Oscuro'}</> }
                        </button>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navegacion;