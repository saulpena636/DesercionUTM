import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import styles from './css/prediccion.module.css'; // Asumiendo que crearás este archivo CSS

const PrediccionEstudiantes = () => {
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem("token"));

    // Estados de la vista general
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusArchivo, setStatusArchivo] = useState(null);

    // Estados para las gráficas
    const [charts, setCharts] = useState(null);

    // Estados para la tabla y paginación
    const [estudiantes, setEstudiantes] = useState([]);
    const [paginacion, setPaginacion] = useState({
        pagina_actual: 1,
        paginas_totales: 1,
        tiene_siguiente: false,
        tiene_anterior: false,
        total_estudiantes_en_riesgo: 0
    });
    const [isTableLoading, setIsTableLoading] = useState(false);

    // 1. Verificar el estado del archivo al montar el componente
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        checkStatus();
    }, [token, navigate]);

    // 2. Cargar datos cuando sabemos que hay un archivo procesado
    useEffect(() => {
        if (statusArchivo?.has_file) {
            fetchEstadisticas();
            fetchEstudiantes(1); // Cargar la primera página por defecto
        }
    }, [statusArchivo]);

    const checkStatus = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/status_archivo`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (res.ok) {
                setStatusArchivo(data);
                if (!data.has_file) {
                    setIsLoading(false); // Terminamos de cargar, mostraremos el mensaje de subir archivo
                }
            } else {
                throw new Error("Error al verificar el estado del archivo");
            }
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const fetchEstadisticas = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/estadisticas_archivo`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setCharts(data.charts);
            }
        } catch (err) {
            console.error("Error al cargar gráficas:", err);
        }
    };

    const fetchEstudiantes = async (page) => {
        setIsTableLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL}/api/predicciones?page=${page}&per_page=10`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                setEstudiantes(data.estudiantes);
                setPaginacion(data.info_paginacion);
            }
        } catch (err) {
            console.error("Error al cargar estudiantes:", err);
        } finally {
            setIsTableLoading(false);
            setIsLoading(false); // Finaliza la carga general inicial
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= paginacion.paginas_totales) {
            fetchEstudiantes(newPage);
        }
    };

    if (isLoading) {
        return <div className={styles.loadingContainer}>Cargando datos del modelo...</div>;
    }

    if (error) {
        return <div className={styles.errorContainer}>{error}</div>;
    }

    // Si no hay archivo, mostramos un mensaje invitando a subir uno
    if (statusArchivo && !statusArchivo.has_file) {
        return (
            <div className={styles.emptyStateContainer}>
                <h2>No hay datos procesados</h2>
                <p>Para ver las predicciones, primero necesitas subir un dataset de alumnos.</p>
                <Link to="/upload" className={styles.primaryButton}>Ir a Subir Archivo</Link>
            </div>
        );
    }

    return (
        <div className={styles.dashboardWrapper}>
            <header className={styles.dashboardHeader}>
                <h1>Resultados de Predicción Grupal</h1>
                <p>Archivo analizado: <strong>{statusArchivo.filename}</strong> (Subido: {new Date(statusArchivo.fecha_subida).toLocaleDateString()})</p>
                <p>Total en riesgo detectado: <strong>{paginacion.total_estudiantes_en_riesgo} alumnos</strong></p>
            </header>

            {/* SECCIÓN DE GRÁFICAS */}
            {charts && (
                <div className={styles.chartsGrid}>
                    <div className={styles.chartCard}>
                        <h3>Distribución de Edades en Riesgo</h3>
                        {charts.pastel_edades ? (
                            <Plot 
                                data={charts.pastel_edades.data || charts.pastel_edades} 
                                layout={{...charts.pastel_edades.layout, autosize: true}} 
                                useResizeHandler={true}
                                style={{ width: "100%", height: "100%" }}
                            />
                        ) : <p>Cargando gráfica...</p>}
                    </div>
                    
                    <div className={styles.chartCard}>
                        <h3>Proporción de Foráneos</h3>
                        {charts.pastel_foraneos ? (
                            <Plot 
                                data={charts.pastel_foraneos.data || charts.pastel_foraneos} 
                                layout={{...charts.pastel_foraneos.layout, autosize: true}} 
                                useResizeHandler={true}
                                style={{ width: "100%", height: "100%" }}
                            />
                        ) : <p>Cargando gráfica...</p>}
                    </div>
                </div>
            )}

            {/* SECCIÓN DE TABLA */}
            <div className={styles.tableSection}>
                <h2>Detalle de Alumnos en Riesgo</h2>
                
                {isTableLoading ? (
                    <p>Actualizando tabla...</p>
                ) : (
                    <div className={styles.tableResponsive}>
                        <table className={styles.studentsTable}>
                            <thead>
                                <tr>
                                    <th>Matrícula</th>
                                    <th>Carrera</th>
                                    <th>Edad</th>
                                    <th>Foráneo</th>
                                    <th>Probabilidad de Deserción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estudiantes.map((est) => (
                                    <tr key={est.matricula}>
                                        <td>{est.matricula}</td>
                                        <td>{est.carrera}</td>
                                        <td>{est.edad}</td>
                                        <td>{est.es_foraneo ? "Sí" : "No"}</td>
                                        <td>
                                            <span className={est.probabilidad > 80 ? styles.highRisk : styles.mediumRisk}>
                                                {est.probabilidad}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* CONTROLES DE PAGINACIÓN */}
                <div className={styles.paginationControls}>
                    <button 
                        onClick={() => handlePageChange(paginacion.pagina_actual - 1)} 
                        disabled={!paginacion.tiene_anterior || isTableLoading}
                        className={styles.pageButton}
                    >
                        Anterior
                    </button>
                    
                    <span>Página {paginacion.pagina_actual} de {paginacion.paginas_totales}</span>
                    
                    <button 
                        onClick={() => handlePageChange(paginacion.pagina_actual + 1)} 
                        disabled={!paginacion.tiene_siguiente || isTableLoading}
                        className={styles.pageButton}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrediccionEstudiantes;