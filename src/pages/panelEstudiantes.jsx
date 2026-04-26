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
                    <p className={styles.subtitulo}>Datos del semestre 2026-A</p>
                    <h2 className={styles.informacion}>Informacion general de todas las carreras</h2>
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
                    </div>{ data.kpis.riesgo !== 0 &&
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