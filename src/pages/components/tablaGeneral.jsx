import React, { useState, useEffect } from 'react';
import styles from './css/tablaGeneral.module.css';

function TablaGeneral({ tablaEstudiantes = [] }) {
    // 1. Estados para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // 2. Si cambian los datos (ej. el usuario hace otro filtro), regresamos a la página 1
    useEffect(() => {
        setCurrentPage(1);
    }, [tablaEstudiantes]);

    // 3. Lógica matemática para cortar el arreglo
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // Extraemos solo los 5 elementos de la página actual
    const currentItems = tablaEstudiantes.slice(indexOfFirstItem, indexOfLastItem);

    // 4. Calculamos el total de páginas
    const totalPages = Math.ceil(tablaEstudiantes.length / itemsPerPage);

    // 5. Funciones de navegación
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className={styles.tablaContainer}>
            <h3 className={styles.titulo}>Tabla de estudiantes en riesgo</h3>
            <table>
                <thead>
                    <tr>
                        <th>Matrícula</th>
                        <th>Carrera</th>
                        <th>Grupo</th>
                        <th>Promedio</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Renderizamos currentItems en lugar de toda la tabla */}
                    {currentItems.map((row, index) => (
                        <tr key={index}>
                            <td>{row['MATRÍCULA']}</td>
                            <td>{row['GRUPO']}</td>
                            <td>{row['CARRERA']}</td>
                            <td>{row['PROMEDIO GENERAL']}</td>
                            <td><a href="#">Ver detalles</a></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 6. Controles visuales de paginación (Solo se muestran si hay más de 1 página) */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                    <button 
                        onClick={prevPage} 
                        disabled={currentPage === 1}
                        className={styles.filtersButton} // Puedes crear una clase específica si prefieres
                    >
                        Anterior
                    </button>
                    
                    <span style={{ fontSize: '14px', color: '#666' }}>
                        Página {currentPage} de {totalPages}
                    </span>
                    
                    <button 
                        onClick={nextPage} 
                        disabled={currentPage === totalPages}
                        className={styles.filtersButton}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}

export default TablaGeneral;