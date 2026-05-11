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
                    <h1>Panel Principal</h1>
                    <p className={styles.subtitulo}>Datos del semestre 2026-A</p>
                </div>
                <button
                    className={styles.reporteButton}
                    
                >
                    <i className="fas fa-file-alt" style={{ marginRight: 8 }}></i>
                    Generar reporte
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