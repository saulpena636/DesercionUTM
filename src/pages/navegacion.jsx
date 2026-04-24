import { NavLink } from "react-router-dom";
import React, { useState } from 'react';
import styles from './css/navbar.module.css';

function Navegacion() {
    // Estado para controlar si el menú móvil está abierto
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Función para alternar el estado
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <div className={styles.mobileHeader}>
                <button onClick={toggleSidebar} className={styles.menuButton}>
                    ☰ {/* Puedes usar un icono de react-icons aquí */}
                </button>
                <h3 style={{ margin: 0, color: '#7E2C2C' }}>DeserciónUTM</h3>
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
                        <li><NavLink to="/perfil" className={({ isActive }) => isActive ? styles.active : ""}><i className="fas fa-file-alt"></i>Buscar Estudiante</NavLink></li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Navegacion;