import { NavLink } from "react-router-dom";
import styles from './css/navbar.module.css';

function Navegacion() {

    return (
        <>
            <nav>
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