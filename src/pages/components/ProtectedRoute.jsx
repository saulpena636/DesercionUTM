import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    // Aquí verificamos si hay una sesión activa. 
    // Lo más común es revisar si guardaste un token en localStorage al hacer login.
    const token = localStorage.getItem("token");

    // Si no hay token, lo mandamos al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay token, permitimos que vea las rutas hijas (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;