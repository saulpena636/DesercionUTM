import styles from './css/cardInfo.module.css';

function cardInfo({icono,titulo,contenido}) {
    return (
        <div className={styles.cardInfo}>
            <div className={styles.iconoInfo} style={{backgroundColor: icono[1]}}>
                <i className={icono[0]} style={{fontSize: "20px", color: icono[2]}}></i>
            </div>
            <p>{titulo}</p>
            <h1 style={{ color: contenido[1] }}>{contenido[0]}</h1>
        </div>
    );
}

export default cardInfo;