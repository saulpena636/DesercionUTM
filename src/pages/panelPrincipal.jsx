import styles from './css/panelPrincipal.module.css';
import CardInfo from './components/cardInfo';
import TablaGeneral from './components/tablaGeneral';
import React, { useState, useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';

function PanelPrincipal() {
    const factory = createPlotlyComponent.default || createPlotlyComponent;
    const Plot = factory(Plotly);
    // Estados para los datos del dashboard
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    const handleDownloadDashboardPDF = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("No estás autenticado. Por favor, inicia sesión.");
            return;
        }

        setIsGeneratingReport(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reporte/dashboard`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    carreras: "",
                    grupos: ""
                })
            });

            if (!response.ok) {
                throw new Error("Error al generar el reporte estadístico en el servidor.");
            }

            const rawBlob = await response.blob();
            const pdfBlob = new Blob([rawBlob], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(pdfBlob);

            // --- SOLUCIÓN PARA ABRIR EN NUEVA PESTAÑA CON TÍTULO ---

            // 1. Abrimos una pestaña en blanco
            const pdfWindow = window.open("");

            // 2. Verificamos que el navegador no haya bloqueado la ventana emergente (Pop-up blocker)
            if (pdfWindow) {
                // 3. Escribimos un HTML estructurado en la nueva pestaña
                pdfWindow.document.write(`
                <html>
                    <head>
                        <title>Reporte_Estadistico_UTM.pdf</title>
                        <style>
                            body { margin: 0; padding: 0; overflow: hidden; background-color: #525659; }
                            iframe { width: 100vw; height: 100vh; border: none; }
                        </style>
                    </head>
                    <body>
                        <iframe src="${url}" title="Reporte PDF"></iframe>
                    </body>
                </html>
            `);
                // Cierra el flujo de escritura del documento
                pdfWindow.document.close();
            } else {
                // Si entra aquí, es porque el usuario tiene un bloqueador de ventanas emergentes activado
                alert("El navegador bloqueó la pestaña. Por favor, permite las ventanas emergentes para este sitio.");
            }

            // Importante: No uses revokeObjectURL inmediatamente o el iframe no cargará
            // Lo limpiamos después de un tiempo prudente
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 10000); // 10 segundos es suficiente para que el visor lo renderice

        } catch (error) {
            console.error("Error generando el PDF:", error);
            alert("Hubo un problema al generar el reporte estadístico. Intenta nuevamente.");
        } finally {
            setIsGeneratingReport(false);
        }
    };

    // 2. Función para obtener datos del dashboard
    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const payload = {
                carreras: "",
                grupos: ""
            };

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            setData(data);
        } catch (err) {
            console.error("Error al filtrar", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) return <div>Cargando información...</div>;

    return (
        <>
            <div className={styles.header}>
                <div>
                    <h1>Panel Estadístico</h1>
                    <p className={styles.subtitulo}>Datos del semestre 2026-A</p>
                </div>
                <button
                    className={styles.reporteButton}
                    onClick={handleDownloadDashboardPDF}
                    disabled={isGeneratingReport}
                    style={{ opacity: isGeneratingReport ? 0.7 : 1, cursor: isGeneratingReport ? 'not-allowed' : 'pointer' }}
                >
                    <i
                        className={isGeneratingReport ? "fas fa-spinner fa-spin" : "fas fa-file-alt"}
                        style={{ marginRight: 8 }}
                    ></i>
                    {isGeneratingReport ? "Procesando documento..." : "Generar reporte"}
                </button>
            </div>
            <h2 className={styles.informacion}>Informacion general de todas las carreras</h2>
            <div className={styles.cards}>
                <CardInfo icono={["fa-solid fa-users-line", "#EACBCB", "#7E2C2C"]} titulo="Total de alumnos" contenido={[data.kpis.total, ""]} />
                <CardInfo icono={["fa-solid fa-exclamation-triangle", "#ffcaca", "#D70000"]} titulo="En riesgo crítico" contenido={[data.kpis.riesgo, "#e74c3c"]} />
                <CardInfo icono={["fa-solid fa-circle-exclamation", "#FFB2C2", "#B20025"]} titulo="Carrera con mas riesgo" contenido={[data.kpis.carrera_riesgo, ""]} />
            </div>
            <TablaGeneral tablaEstudiantes={data.tabla.slice(0, 5)} />

            <div className={styles.row}>
                <div className={styles.card66}>
                    <Plot
                        data={data.charts.histograma_carrera.data}
                        layout={{
                            ...data.charts.histograma_carrera.layout,
                            autosize: true,
                            useResizeHandler: true,
                            width: undefined, // Para que tome el ancho del contenedor padre
                            height: 450
                        }}
                        style={{ width: "100%" }}
                        config={{ responsive: true }}
                    />
                </div>
                <div className={styles.card33}>
                    <Plot
                        data={data.charts.dona.data}
                        layout={{
                            ...data.charts.dona.layout, autosize: true,
                            useResizeHandler: true,
                            width: undefined, // Para que tome el ancho del contenedor padre
                            height: 450
                        }}
                        style={{ width: "100%" }}
                        config={{ responsive: true }}
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.card50}>
                    <Plot
                        data={data.charts.lineas.data}
                        layout={{
                            ...data.charts.lineas.layout, autosize: true,
                            useResizeHandler: true,
                            width: undefined, // Para que tome el ancho del contenedor padre
                            height: 450
                        }}
                        style={{ width: "100%" }}
                        config={{ responsive: true }}
                    />
                </div>
                <div className={styles.card50}>
                    <Plot
                        data={data.charts.pastel_riesgo.data}
                        layout={{
                            ...data.charts.pastel_riesgo.layout, autosize: true,
                            useResizeHandler: true,
                            width: undefined, // Para que tome el ancho del contenedor padre
                            height: 450
                        }}
                        style={{ width: "100%" }}
                        config={{ responsive: true }}
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.card33}>
                    <Plot
                        data={data.charts.genero.data}
                        layout={{
                            ...data.charts.genero.layout, autosize: true,
                            useResizeHandler: true,
                            width: undefined, // Para que tome el ancho del contenedor padre
                            height: 450
                        }}
                        style={{ width: "100%" }}
                        config={{ responsive: true }}
                    />
                </div>
                <div className={styles.card66}>
                    <Plot
                        data={data.charts.barras.data}
                        layout={{
                            ...data.charts.barras.layout, autosize: true,
                            useResizeHandler: true,
                            width: undefined, // Para que tome el ancho del contenedor padre
                            height: 450
                        }}
                        style={{ width: "100%" }}
                        config={{ responsive: true }}
                    />
                </div>
            </div>

        </>
    );
}

export default PanelPrincipal;