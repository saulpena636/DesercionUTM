import React, { useState, useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import styles from './css/perfilEstudiante.module.css';
import CardInfo from './components/cardInfo';

const PerfilEstudiante = () => {
    const [busqueda, setBusqueda] = useState('');
    const [estudiante, setEstudiante] = useState(null);

    const factory = createPlotlyComponent.default || createPlotlyComponent;
    const Plot = factory(Plotly);

    // Simulamos la búsqueda al backend
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/predict`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ matricula: busqueda })
            });
            if (!res.ok) throw new Error("Error en la búsqueda");

            const data = await res.json();
            setEstudiante(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };
    useEffect(() => {
        console.log("Estudiante actualizado:", estudiante);
    }, [estudiante]);

    return (
        <>
            <div className={styles.header}>
                <h1 className={styles.title}>Buscar estudiante</h1>
                <p className={styles.subtitle}>Ingresa la matrícula del estudiante para generar un análisis</p>

                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Matrícula..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <button type="submit" className={styles.searchButton}>Analizar perfil</button>
                </form>
            </div>

            {estudiante && (
                <>
                    {/* Header del Estudiante */}
                    <div className={styles.studentHeader}>
                        <div className={styles.studentInfo}>
                            <i className="fas fa-exclamation-triangle" style={{ marginRight: 8 }}></i>
                            <div>
                                <h2 className={styles.matricula}>{estudiante.estudiante.matricula}</h2>
                                { /*estudiante.carrera && <p className={styles.carrera}>{estudiante.carrera}<br/>{estudiante.semestre}</p>*/}
                            </div>
                        </div>
                        {estudiante.prediccion?.prediccion_clase ? <div className={styles.badgeRiesgo}>EN RIESGO</div> : <div className={styles.badgeSeguro}>RIESGO BAJO</div>}
                    </div>

                    {/* Grid Principal de Datos */}
                    <div className={styles.gridContainer}>
                        <h2 className={styles.subtitulo}>Perfil del Estudiante</h2>
                        <div className={styles.row}>
                            <CardInfo icono={["fa-solid fa-users-line", "#EACBCB", "#7E2C2C"]} titulo="Grupo" contenido={[estudiante.estudiante.grupo, "#000000"]} />
                            <CardInfo icono={["fa-solid fa-users-line", "#EACBCB", "#7E2C2C"]} titulo="carrera" contenido={[estudiante.estudiante.carrera, "#000000"]} />
                            <CardInfo icono={["fa-solid fa-users-line", "#EACBCB", "#7E2C2C"]} titulo="edad" contenido={[estudiante.estudiante.edad + " años", "#000000"]} />
                        </div>
                        <div className={styles.row}>
                            <div className={styles.card33}>
                                <div className={styles.iconoInfo} style={{ backgroundColor: "#ffffff" }}>
                                    <i className="fa-solid fa-trophy" style={{ fontSize: "20px", color: "#7E2C2C" }}></i>
                                </div>
                                <p>promedio general</p>
                                <h1 style={{ color: "#FFFFFF" }}>{estudiante.estudiante.promedio_general}</h1>

                                <div className={styles.iconoInfo} style={{ backgroundColor: "#ffffff" }}>
                                    <i className="fa-solid fa-award" style={{ fontSize: "20px", color: "#7E2C2C" }}></i>
                                </div>
                                <p>promedio del ciclo anterior</p>
                                <h1 style={{ color: "#FFFFFF" }}>{estudiante.estudiante.promedio_ciclo_anterior}</h1>

                            </div>
                            <div className={styles.column}>
                                <div className={styles.row}>
                                    <CardInfo icono={["fa-solid fa-users-line", "#EACBCB", "#7E2C2C"]} titulo="Estado" contenido={[estudiante.estudiante.estado, "#000000"]} />
                                </div>
                                <div className={styles.row}>
                                    <CardInfo icono={["fa-solid fa-users-line", "#EACBCB", "#7E2C2C"]} titulo="Semestre" contenido={[estudiante.estudiante.periodo_actual + "° semestre", "#000000"]} />
                                    <CardInfo icono={["fa-solid fa-users-line", "#EACBCB", "#7E2C2C"]} titulo="¿Es foraneo?" contenido={[estudiante.estudiante.es_foraneo ? "Sí" : "No", "#000000"]} />
                                </div>
                            </div>
                        </div>

                        <h2 className={styles.subtitulo}>Información predictiva</h2>
                        <div className={styles.row}>
                            <div className={`${styles.card} ${estudiante?.prediccion.prediccion_clase ? styles.cardRed : styles.cardGreen}`}>
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}><i className="fas fa-exclamation-triangle" ></i></div>
                                <p className={styles.cardTitle}>Probabilidad de deserción</p>
                                <h3 className={styles.cardValue}>{(estudiante.prediccion.probabilidad_riesgo * 100).toFixed(2)}%</h3>
                            </div>

                            {/* Factor Principal */}
                            <div className={styles.card}>
                                <div className={styles.iconBox} style={{ backgroundColor: '#FFE5E5' }}></div>
                                <p className={styles.cardTitle}>Factor principal</p>
                                <h3 className={styles.cardValue}>--</h3>
                            </div>
                        </div>

                    </div>
                </>
            )}
        </>
    );
};

export default PerfilEstudiante;