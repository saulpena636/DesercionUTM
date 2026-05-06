import styles from './css/login.module.css';

const Login = () => {

    return (
        <div className={styles.loginContainer}>
            <h1 className={styles.loginTitle}>DesercionUTM</h1>
            <div className={styles.loginForm}>
                <h2 className={styles.loginSubtitle}>Inicia sesión con tu usuario y contraseña</h2>
                <form className={styles.form}>
                    <input type="text" className={styles.loginInput} placeholder="Usuario" />
                    <input type="password" className={styles.loginInput} placeholder="Contraseña" />
                    <button type="submit" className={styles.loginButton}>Iniciar sesión</button>
                </form>
            </div>
        </div>
    )
}

export default Login;