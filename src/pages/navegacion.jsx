import { NavLink } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import styles from './css/navbar.module.css';

function Navegacion() {
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
                    {/* Botón de Modo Oscuro en Escritorio (Abajo en el sidebar) */}
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
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