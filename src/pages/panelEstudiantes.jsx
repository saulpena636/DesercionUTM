import styles from './css/panelPrincipal.module.css';
import CardInfo from './components/cardInfo';
import TablaGeneral from './components/tablaGeneral';
import React, { useState, useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';


function PanelEstudiantes() {
    const factory = createPlotlyComponent.default || createPlotlyComponent;
    const Plot = factory(Plotly);
    // Estados para los datos del dashboard
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [options, setOptions] = useState({
        carreras: [],
        todos_los_grupos: [],
        grupos_por_carrera: {}
    });

    const [selectedCarreras, setSelectedCarreras] = useState("");
    const [selectedGrupos, setSelectedGrupos] = useState("");
    const [filtroGrupoDeshabilitado, setFiltroGrupoDeshabilitado] = useState(true);

    const isBotonDeshabilitado = selectedCarreras === "" && selectedGrupos === "";

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
                    carreras: selectedCarreras,
                    grupos: selectedGrupos
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

    useEffect(() => {
        const loadMetadata = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/metadata`);
                if (!res.ok) throw new Error('Error en la respuesta');
                const data = await res.json();
                setOptions(data);
                // Habilitamos el filtro de grupo una vez que tenemos las opciones
            } catch (err) {
                console.error("Error cargando filtros", err);
            }
        };
        loadMetadata();
    }, []);

    // LÓGICA DE CASCADA: Determinamos qué grupos mostrar en el segundo dropdown
    const gruposAMostrar = selectedCarreras === ""
        ? options.todos_los_grupos
        : options.grupos_por_carrera[selectedCarreras] || [];

    // Manejador especial para cuando cambia la carrera
    const handleCarreraChange = (e) => {
        const nuevaCarrera = e.target.value;
        setSelectedCarreras(nuevaCarrera);
        // IMPORTANTE: Reseteamos el grupo cuando la carrera cambia
        setSelectedGrupos("");
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        setFiltroGrupoDeshabilitado(selectedGrupos === "");
        console.log(filtroGrupoDeshabilitado);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/estudiantes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    carreras: selectedCarreras,
                    grupos: selectedGrupos
                })
            });

            if (!res.ok) throw new Error('Error en la respuesta');

            const data = await res.json();
            setData(data);
        } catch (err) {
            console.error("Error al filtrar", err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <h1>Panel de Estudiantes por carrera y grupo</h1>

            <div className={styles.filtersContainer}>
                {/* DROPDOWN DE CARRERAS */}
                <select
                    className={styles.filtersSelect}
                    value={selectedCarreras}
                    onChange={(e) => {
                        setSelectedCarreras(e.target.value);
                        setSelectedGrupos(""); // Resetear grupo al cambiar carrera
                    }}
                >
                    {/* Default que obliga a elegir */}
                    <option value="" disabled>-- Selecciona una carrera --</option>
                    {options.carreras.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select
                    className={styles.filtersSelect}
                    value={selectedGrupos}
                    onChange={(e) => setSelectedGrupos(e.target.value)}
                >
                    {/* Default que obliga a elegir */}
                    <option value="">Todos los grupos</option>
                    {gruposAMostrar.map(g => <option key={g} value={g}>{g}</option>)}
                </select>

                <button
                    className={styles.filtersButton}
                    onClick={fetchDashboardData}
                    disabled={isBotonDeshabilitado} // 2. Se apaga si ambos están vacíos
                >
                    <i className="fas fa-filter" style={{ marginRight: 8 }}></i>
                    Filtrar
                </button>
            </div>
            {loading ? <div>Seleccione una carrera o grupo para mostrar la información...</div> : (
                <>
                    <div className={styles.header}>
                        <div>
                            <p className={styles.subtitulo}>Datos del semestre 2026-A</p>
                            <h2 className={styles.informacion}>Informacion general de {selectedCarreras || 'todas las carreras'}</h2>
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
                    <div className={styles.cards}>
                        <CardInfo icono={["fa-solid fa-users-line", "#EACBCB", "#7E2C2C"]} titulo="Total de alumnos" contenido={[data.kpis.total, "#000000"]} />
                        <CardInfo icono={["fa-solid fa-exclamation-triangle", "#ffcaca", "#D70000"]} titulo="En riesgo crítico" contenido={[data.kpis.riesgo, "#e74c3c"]} />
                        {filtroGrupoDeshabilitado ? <CardInfo icono={["fa-solid fa-id-card-clip", "#FFFC97", "#A19300"]} titulo="Grupo con mas riesgo" contenido={[data.kpis.grupo_riesgo, "#7c7200"]} /> : <CardInfo icono={["fa-solid fa-check-circle", "#CBEACC", "#00572E"]} titulo="Promedio grupal" contenido={[data.kpis.promedio, "#27ae60"]} />}
                    </div>
                    <TablaGeneral tablaEstudiantes={data.tabla} />

                    <div className={styles.row}>
                        <div className={styles.card100}>
                            <Plot
                                data={data.charts.distribucion_promedios.data}
                                Layout={{
                                    ...data.charts.distribucion_promedios.layout, autosize: true,
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
                    </div>{data.kpis.riesgo !== 0 &&
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
                        </div>}
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
            )}

        </>
    );
}

export default PanelEstudiantes;