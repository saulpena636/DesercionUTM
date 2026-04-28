import React, { useState, useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import styles from './css/perfilEstudiante.module.css';

const PerfilEstudiante = () => {
    const [busqueda, setBusqueda] = useState('');
    const [estudiante, setEstudiante] = useState(null);

    const factory = createPlotlyComponent.default || createPlotlyComponent;
    const Plot = factory(Plotly);

    // Simulamos la búsqueda al backend
    const handleSearch = async (e) => {
        e.preventDefault();
        try{
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
                                <h2 className={styles.matricula}>{estudiante.matricula}</h2>
                                { /*estudiante.carrera && <p className={styles.carrera}>{estudiante.carrera}<br/>{estudiante.semestre}</p>*/ }
                            </div>
                        </div>
                        {estudiante?.prediccion_clase ? <div className={styles.badgeRiesgo}>EN RIESGO</div> : <div className={styles.badgeSeguro}>RIESGO BAJO</div>}
                    </div>

                    {/* Grid Principal de Datos */}
                    <div className={styles.gridContainer}>
                        
                        {/* 97.8% (Rojo brillante) */}
                        <div className={`${styles.card} ${estudiante?.prediccion_clase ? styles.cardRed : styles.cardGreen}`}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}><i className="fas fa-exclamation-triangle" ></i></div>
                            <p className={styles.cardTitle}>Probabilidad de deserción</p>
                            <h3 className={styles.cardValue}>{(estudiante.probabilidad_riesgo * 100).toFixed(2)}%</h3>
                        </div>

                        {/* Factor Principal */}
                        <div className={styles.card}>
                            <div className={styles.iconBox} style={{backgroundColor: '#FFE5E5'}}></div>
                            <p className={styles.cardTitle}>Factor principal</p>
                            <h3 className={styles.cardValue}>N/A</h3>
                        </div>

                    </div>
                </>
            )}
        </>
    );
};

export default PerfilEstudiante;