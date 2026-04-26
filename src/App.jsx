import { Routes, Route } from "react-router-dom";
import './App.css'
import Navegacion from './pages/navegacion.jsx';
import PanelPrincipal from './pages/panelPrincipal.jsx';
import PanelEstudiantes from './pages/panelEstudiantes.jsx';
import PerfilEstudiante from './pages/perfilEstudiante.jsx';
import eruda from 'eruda'


function App() {
  if (process.env.NODE_ENV === 'development') {
    eruda.init()
  }
  return (
    <>
      <Navegacion/>
      <main>
        <Routes>
          <Route path="/" element={<PanelPrincipal />} />
          <Route path="/estudiantes" element={<PanelEstudiantes />} />
          <Route path="/perfil" element={<PerfilEstudiante />} />
        </Routes>
      </main>
    </>
  )
}

export default App
