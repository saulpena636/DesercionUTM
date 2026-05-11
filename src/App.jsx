import { Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Navegacion from './pages/navegacion.jsx';
import PanelPrincipal from './pages/panelPrincipal.jsx';
import PanelEstudiantes from './pages/panelEstudiantes.jsx';
import PerfilEstudiante from './pages/perfilEstudiante.jsx';
import FileUpload from './pages/fileUpload.jsx';
import Login from './pages/login.jsx';
import ProtectedRoute from './pages/components/ProtectedRoute.jsx';
import Signup from './pages/signup.jsx';
import eruda from 'eruda'
import PrediccionEstudiantes from "./pages/prediccionEstudiantes.jsx";


function App() {
  if (process.env.NODE_ENV === 'development') {
    eruda.init()
  }
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route path="*" element={
          <>
            <Navegacion />
            <main>
              <Routes>
                <Route path="/" element={<PanelPrincipal />} />
                <Route path="/estudiantes" element={<PanelEstudiantes />} />
                <Route path="/perfil" element={<PrediccionEstudiantes />} />
                <Route path="/upload" element={<FileUpload />} />
              </Routes>
            </main>
          </>
        } />
      </Route>
    </Routes>
  )
}

export default App
