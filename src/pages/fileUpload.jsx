import React, { useState, useRef } from 'react';
import styles from './css/fileUpload.module.css';

const FileUpload = () => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const inputRef = useRef(null);

    // Tipos de archivos permitidos
    const excelTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel" // .xls
    ];

    // Manejar el arrastre (dentro y fuera)
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Validar y agregar archivos
    const handleFiles = (newFiles) => {
        const validFiles = Array.from(newFiles).filter(file => excelTypes.includes(file.type));
        
        if (validFiles.length !== newFiles.length) {
            alert("Solo se permiten archivos de Excel (.xlsx, .xls)");
        }

        setFiles((prev) => [...prev, ...validFiles]);
    };

    // Manejar el soltado (Drop)
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    // Manejar selección manual (Click)
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <div className={styles.wrapper}>
            <div 
                className={`${styles.uploadContainer} ${dragActive ? styles.dragActive : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()} // Al dar clic, abre el explorador
            >
                {/* Input oculto */}
                <input 
                    ref={inputRef}
                    type="file" 
                    multiple 
                    accept=".xlsx, .xls"
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />
                
                <span className={styles.icon}><i class="fa-solid fa-file-excel"></i></span>
                <p className={styles.text}>Arrastra tus archivos de Excel aquí</p>
                <span className={styles.subtext}>O haz clic para buscar en tu computadora</span>
                <span className={styles.subtext}>(Solo .xlsx y .xls)</span>
            </div>

            {/* Lista de archivos cargados */}
            {files.length > 0 && (
                <ul className={styles.fileList}>
                    {files.map((file, idx) => (
                        <li key={idx} className={styles.fileItem}>
                            <span><i class="fa-solid fa-file"></i> {file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                            <button onClick={() => removeFile(idx)} className={styles.removeBtn}>✕</button>
                        </li>
                    ))}
                </ul>
            )}

            {files.length > 0 && (
                <button 
                    className={styles.filtersButton} 
                    style={{ marginTop: '20px', width: '100%' }}
                    onClick={() => console.log("Enviando a la IA:", files)}
                >
                    Procesar Predicción Grupal
                </button>
            )}
        </div>
    );
};

export default FileUpload;