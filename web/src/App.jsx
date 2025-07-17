import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Perfil from "./pages/Perfil";
import PasosFacil from "./pages/PasosFacil";
import PasosAvanzados from "./pages/PasosAvanzados";
import Home from "./pages/Home";
import Descripcion from "./pages/Descripcion";

import MainLayout from "./layouts/MainLayout";
import EditarPerfil from "./pages/EditarPerfil";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas sin header y footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas con header y footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/Perfil" element={<Perfil />} />
          <Route path="/EditarPerfil" element={<EditarPerfil />} />
        <Route path="/PasosFacil" element={<PasosFacil />} />
          <Route path="/PasosAvanzados" element={<PasosAvanzados />} />
          <Route path="/descripcion/:nombreReceta" element={<Descripcion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
