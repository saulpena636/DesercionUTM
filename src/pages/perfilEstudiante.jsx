import React, { useState } from 'react';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import styles from './css/perfilEstudiante.module.css';

const PerfilEstudiante = () => {
    const [busqueda, setBusqueda] = useState('2021020012');
    const [estudiante, setEstudiante] = useState(null);

    const factory = createPlotlyComponent.default || createPlotlyComponent;
    const Plot = factory(Plotly);

    // Simulamos la búsqueda al backend
    const handleSearch = (e) => {
        e.preventDefault();
        // Aquí en el futuro harás el fetch a Flask
        setEstudiante({
            matricula: "2021020012",
            carrera: "Ingeniería en Mecatrónica",
            semestre: "Sexto semestre",
            probabilidadRiesgo: "97.8%",
            factorPrincipal: "Inasistencias",
            totalAsistencias: "60.1%",
            promedioGeneral: "7.1",
            creditosAprobados: "48.6%",
            promedioUltimoSemestre: "6.9",
            materiasAcreditadas: "3",
            // Datos para las gráficas
            historialAsistencias: { x: ['S1', 'S2', 'S3', 'S4', 'S5'], y: [65, 58, 55, 64, 54] },
            historialPromedios: { x: ['S1', 'S2', 'S3', 'S4', 'S5'], y: [8.0, 7.2, 6.9, 6.8, 6.9] }
        });
    };

    // Configuración visual para la gráfica de Asistencias
    const figAsistencias = {
        data: [{
            x: estudiante?.historialAsistencias.x,
            y: estudiante?.historialAsistencias.y,
            type: 'bar',
            // El último valor es rojo fuerte, los demás rosados
            marker: { color: ['#EAA4A4', '#EAA4A4', '#EAA4A4', '#EAA4A4', '#E30000'] },
            text: estudiante?.historialAsistencias.y.map(String).map(v => v + '%'),
            textposition: 'outside',
        }],
        layout: {
            autosize: true, margin: { l: 20, r: 20, t: 20, b: 30 },
            paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
            xaxis: { showgrid: false, visible: false },
            yaxis: { showgrid: false, visible: false, range: [0, 100] }
        }
    };

    // Configuración visual para la gráfica de Promedios
    const figPromedios = {
        data: [{
            x: estudiante?.historialPromedios.x,
            y: estudiante?.historialPromedios.y,
            type: 'bar',
            marker: { color: ['#D6B5B5', '#D6B5B5', '#D6B5B5', '#D6B5B5', '#7E2C2C'] },
            text: estudiante?.historialPromedios.y,
            textposition: 'outside',
        }],
        layout: {
            autosize: true, margin: { l: 20, r: 20, t: 20, b: 30 },
            paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
            xaxis: { showgrid: false, visible: false },
            yaxis: { showgrid: false, visible: false, range: [0, 10] }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Buscar estudiante</h1>
                <p className={styles.subtitle}>Ingresa la matrícula del estudiante para generar un análisis</p>
                
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input 
                        type="text" 
                        className={styles.searchInput}
                        placeholder="🔍 Matrícula..."
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
                                <h2 className={styles.matricula}>{estudiante.matricula}</h2>
                                <p className={styles.carrera}>{estudiante.carrera}<br/>{estudiante.semestre}</p>
                            </div>
                        </div>
                        <div className={styles.badgeRiesgo}>EN RIESGO</div>
                    </div>

                    {/* Grid Principal de Datos */}
                    <div className={styles.gridContainer}>
                        
                        {/* 97.8% (Rojo brillante) */}
                        <div className={`${styles.card} ${styles.cardRed}`}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}><i className="fas fa-exclamation-triangle" ></i></div>
                            <p className={styles.cardTitle}>Probabilidad de deserción</p>
                            <h3 className={styles.cardValue}>{estudiante.probabilidadRiesgo}</h3>
                        </div>

                        {/* Factor Principal */}
                        <div className={styles.card}>
                            <div className={styles.iconBox} style={{backgroundColor: '#FFE5E5'}}></div>
                            <p className={styles.cardTitle}>Factor principal</p>
                            <h3 className={styles.cardValue}>{estudiante.factorPrincipal}</h3>
                        </div>

                        {/* Total Asistencias */}
                        <div className={styles.card}>
                            <div className={styles.iconBox} style={{backgroundColor: '#F5E6E6'}}></div>
                            <p className={styles.cardTitle}>Total de asistencias</p>
                            <h3 className={styles.cardValue}>{estudiante.totalAsistencias}</h3>
                        </div>

                        {/* Gráfica Asistencias (Ocupa 2 columnas) */}
                        <div className={`${styles.card} ${styles.colSpan2}`}>
                            <h4 style={{ margin: '0 0 10px 0' }}>Porcentaje de asistencias por semestre</h4>
                            <div style={{ height: '200px', backgroundColor: '#F8F8F8', borderRadius: '8px' }}>
                                <Plot data={figAsistencias.data} layout={figAsistencias.layout} config={{displayModeBar: false, responsive: true}} style={{width: '100%', height: '100%'}} />
                            </div>
                        </div>

                        {/* Promedio General */}
                        <div className={styles.card}>
                            <div className={styles.iconBox} style={{backgroundColor: '#F5E6E6'}}></div>
                            <p className={styles.cardTitle}>Promedio general</p>
                            <h3 className={styles.cardValue}>{estudiante.promedioGeneral}</h3>
                        </div>

                        {/* Tarjeta Roja Oscura Vertical (Ocupa 2 filas) */}
                        <div className={`${styles.card} ${styles.cardDarkRed} ${styles.rowSpan2}`}>
                            <div>
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏆</div>
                                <p className={styles.cardTitle}>Promedio del último semestre</p>
                                <h3 className={styles.cardValue}>{estudiante.promedioUltimoSemestre}</h3>
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '8px', margin: '0 auto 10px auto' }}></div>
                                <p className={styles.cardTitle}>Número de materias acreditadas</p>
                                <h3 className={styles.cardValue}>{estudiante.materiasAcreditadas}</h3>
                            </div>
                        </div>

                        {/* Gráfica Promedios (Ocupa 2 columnas) */}
                        <div className={`${styles.card} ${styles.colSpan2}`}>
                            <h4 style={{ margin: '0 0 10px 0' }}>Promedio general por semestre</h4>
                            <div style={{ height: '250px', backgroundColor: '#F8F8F8', borderRadius: '8px' }}>
                                <Plot data={figPromedios.data} layout={figPromedios.layout} config={{displayModeBar: false, responsive: true}} style={{width: '100%', height: '100%'}} />
                            </div>
                        </div>

                        {/* Tarjetas Placeholders Inferiores */}
                        <div className={styles.card}>
                            <div className={styles.iconBox} style={{backgroundColor: '#EAA4A4'}}></div>
                            <p className={styles.cardTitle}>Titulo</p>
                            <h3 className={styles.cardValue}>Cantidad</h3>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.iconBox} style={{backgroundColor: '#EAA4A4'}}></div>
                            <p className={styles.cardTitle}>Titulo2</p>
                            <h3 className={styles.cardValue}>Dato2</h3>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PerfilEstudiante;