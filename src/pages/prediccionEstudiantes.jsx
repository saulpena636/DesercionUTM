import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import styles from './css/prediccion.module.css'; // Asumiendo que crearás este archivo CSS

const PrediccionEstudiantes = () => {
    const factory = createPlotlyComponent.default || createPlotlyComponent;
    const Plot = factory(Plotly);

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

    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPDF = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("No estás autenticado. Por favor, inicia sesión.");
        return;
    }

    setIsDownloading(true);

    try {
        // 1. Uso de la variable correcta (nota que quitamos el /api extra porque ya viene en el .env)
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reporte/pdf`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!response.ok) {
            throw new Error("Error al generar el reporte en el servidor.");
        }

        // 2. Convertir la respuesta a Blob
        const rawBlob = await response.blob();

        // 3. Forzar el tipo MIME a PDF. 
        // Esto le dice al navegador que no lo descargue, sino que use su visor nativo de PDFs.
        const pdfBlob = new Blob([rawBlob], { type: 'application/pdf' });

        // 4. Crear la URL temporal
        const url = window.URL.createObjectURL(pdfBlob);

        // 5. Abrir en una nueva pestaña
        window.open(url, '_blank');
        
        // 6. Limpieza: Damos un tiempo de gracia de unos segundos antes de revocar la URL
        // para asegurarnos de que la nueva pestaña termine de renderizar el archivo.
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 5000);

    } catch (error) {
        console.error("Error generando el PDF:", error);
        alert("Hubo un problema al generar el reporte. Intenta nuevamente.");
    } finally {
        setIsDownloading(false);
    }
};

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
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/status_archivo`, {
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
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/estadisticas_archivo`, {
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
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/predicciones?page=${page}&per_page=10`, {
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
                <Link to="/upload" className={styles.primaryButton} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>Ir a Subir Datos</Link>
            </div>
        );
    }

    return (
        <div className={styles.dashboardWrapper}>
            <header className={styles.dashboardHeader}>
                <div>
                    <h1>Resultados de Predicción Grupal</h1>
                    <p>Archivo analizado: <strong>{statusArchivo.filename}</strong> (Subido: {new Date(statusArchivo.fecha_subida).toLocaleDateString()})</p>
                    <p>Total en riesgo detectado: <strong>{paginacion.total_estudiantes_en_riesgo} alumnos</strong></p>
                </div>
                <button
                    className={styles.reporteButton}
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    style={{ opacity: isDownloading ? 0.7 : 1, cursor: isDownloading ? 'not-allowed' : 'pointer' }}
                >
                    <i
                        className={isDownloading ? "fas fa-spinner fa-spin" : "fas fa-file-alt"}
                        style={{ marginRight: 8 }}
                    ></i>
                    {isDownloading ? "Generando..." : "Generar reporte"}
                </button>
            </header>

            {/* SECCIÓN DE TABLA */}
            <div className={styles.tablaContainer}>
                <h2 className={styles.titulo}>Detalle de Alumnos en Riesgo</h2>

                {isTableLoading ? (
                    <p>Actualizando tabla...</p>
                ) : (
                    <div className={styles.tableResponsive}>
                        <table className={styles.tablaEstudiantes}>
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
                                        <td data-label="Matrícula">{est.matricula}</td>
                                        <td data-label="Carrera">{est.carrera}</td>
                                        <td data-label="Edad">{est.edad}</td>
                                        <td data-label="Foráneo">{est.es_foraneo ? "Sí" : "No"}</td>
                                        <td data-label="Probabilidad de Deserción">
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
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

            {/* SECCIÓN DE GRÁFICAS */}
            {charts && (
                <div className={styles.chartsGrid}>
                    <div className={styles.card100}>
                        <h3>Distribución de Edades en Riesgo</h3>
                        {charts.pastel_edades ? (
                            <Plot
                                data={charts.pastel_edades.data}
                                layout={{
                                    ...charts.pastel_edades.layout,
                                    autosize: true,
                                    useResizeHandler: true,
                                    width: undefined, // Para que tome el ancho del contenedor padre
                                    height: 450
                                }}
                                style={{ width: "100%" }}
                                config={{ responsive: true }}
                            />
                        ) : <p>Cargando gráfica...</p>}
                    </div>

                    <div className={styles.card100}>
                        <h3>Proporción de Foráneos</h3>
                        {charts.pastel_foraneos ? (
                            <Plot
                                data={charts.pastel_foraneos.data}
                                layout={{
                                    ...charts.pastel_foraneos.layout,
                                    autosize: true,
                                    useResizeHandler: true,
                                    width: undefined, // Para que tome el ancho del contenedor padre
                                    height: 450
                                }}
                                style={{ width: "100%" }}
                                config={{ responsive: true }}
                            />
                        ) : <p>Cargando gráfica...</p>}
                    </div>
                </div>
            )}

        </div>
    );
};

export default PrediccionEstudiantes;