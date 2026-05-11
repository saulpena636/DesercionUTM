import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import styles from './css/fileUpload.module.css';

const FileUpload = () => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]); 
    
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    
    const inputRef = useRef(null);
    const navigate = useNavigate(); // Inicializamos el hook

    const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
        "application/vnd.ms-excel", 
        "text/csv" 
    ];
    const allowedExtensions = ['.xlsx', '.xls', '.csv'];

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleFiles = (incomingFiles) => {
        setSuccessMessage(""); 
        setErrorMessage("");
        
        const file = incomingFiles[0]; 
        if (!file) return;

        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        const isValid = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);

        if (!isValid) {
            alert("Solo se permiten archivos .xlsx, .xls o .csv");
            return;
        }

        setFiles([file]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const removeFile = () => {
        setFiles([]); 
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        const token = localStorage.getItem("token");

        if (!token) {
            setErrorMessage("No estás autenticado. Por favor, inicia sesión de nuevo.");
            return;
        }

        setIsLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const formData = new FormData();
            formData.append('file', files[0]);

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` 
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Mostramos el mensaje de éxito del backend
                setSuccessMessage(data.message + " Redirigiendo a resultados...");
                setFiles([]); 
                
                // Redirigimos a la tabla después de 1.5 segundos
                setTimeout(() => {
                    navigate('/perfil');
                }, 1500);

            } else {
                throw new Error(data.message || `Error al procesar el archivo ${files[0].name}`);
            }
            
        } catch (error) {
            console.error("Error en la subida:", error);
            setErrorMessage(error.message || "Hubo un problema al conectar con el servidor.");
            setIsLoading(false); // Solo quitamos el loading si hay error, si es éxito dejamos que fluya la redirección
        }
    };

    return (
        <div className={styles.wrapper}>
            <div 
                className={`${styles.uploadContainer} ${dragActive ? styles.dragActive : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()} 
            >
                <input 
                    ref={inputRef}
                    type="file" 
                    accept=".xlsx, .xls, .csv"
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />
                
                <span className={styles.icon}>
                    <i className="fa-solid fa-file-excel"></i> / <i className="fa-solid fa-file-csv"></i>
                </span>
                <p className={styles.text}>Arrastra tu archivo de datos aquí</p>
                <span className={styles.subtext}>O haz clic para buscar en tu computadora</span>
                <span className={styles.subtext}>(Solo 1 archivo: .xlsx, .xls o .csv)</span>
            </div>

            {errorMessage && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green', marginTop: '10px', textAlign: 'center' }}>{successMessage}</p>}

            {files.length > 0 && (
                <ul className={styles.fileList}>
                    <li className={styles.fileItem}>
                        <span><i className="fa-solid fa-file"></i> {files[0].name} ({(files[0].size / 1024).toFixed(1)} KB)</span>
                        <button onClick={removeFile} className={styles.removeBtn} disabled={isLoading}>✕</button>
                    </li>
                </ul>
            )}

            {files.length > 0 && (
                <button 
                    className={styles.filtersButton} 
                    style={{ marginTop: '20px', width: '100%', opacity: isLoading ? 0.7 : 1 }}
                    onClick={handleUpload}
                    disabled={isLoading}
                >
                    {isLoading ? "Procesando predicción..." : "Procesar Predicción Grupal"}
                </button>
            )}
        </div>
    );
};

export default FileUpload;