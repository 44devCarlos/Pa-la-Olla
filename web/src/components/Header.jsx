import { useEffect, useState } from "react";
import logoPaLaOlla from "../assets/img/logo.png";
import iconoUsuario from "../assets/img/user.png";
import { Link } from "react-router-dom";

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUser(JSON.parse(usuarioGuardado));
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUser(null);
    window.location.href = "/login"; // o puedes usar navigate si usas React Router
  };

  return (
    <header className="flex items-center justify-between bg-white p-1 shadow-sm md:px-6 md:py-4">
      {/* Logo y Nombre */}
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoPaLaOlla} alt="Logo" className="h-6 w-6" />
          <span className="text-lg font-bold text-red-800">Pa' la olla</span>
        </Link>
      </div>

      {/* Botones dependiendo del estado de sesión */}
      <div className="flex items-center gap-4">
        {user ? (
          // Usuario autenticado
          <>
            <button
              className="group flex cursor-pointer items-center gap-2 rounded-md border border-red-600 px-4 py-2 transition-all duration-200 hover:bg-red-600"
              onClick={() => (window.location.href = "/Perfil")}
            >
              <img
                src={iconoUsuario}
                alt="Usuario"
                className="h-6 w-6 group-hover:brightness-0 group-hover:contrast-100 group-hover:invert group-hover:filter"
              />
              <span className="font-bold text-red-600 group-hover:text-white">
                {user?.nombre_usuario || "Usuario"}
              </span>
            </button>

            <button
              onClick={cerrarSesion}
              className="cursor-pointer rounded-md bg-red-600 px-3 py-2 text-white transition hover:bg-red-700"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          // Usuario no autenticado
          <>
            <button
              className="flex items-center gap-2 rounded-md border border-orange-600 px-4 py-2 font-semibold text-orange-600 transition-all duration-150 hover:bg-orange-50"
              onClick={() => (window.location.href = "/login")}
            >
              <span className="text-lg">↦</span>
              Iniciar Sesión
            </button>

            <button
              className="rounded-md bg-[#e91e63] px-4 py-2 font-semibold text-white transition-colors duration-150 hover:bg-[#c2185b]"
              onClick={() => (window.location.href = "/register")}
            >
              Registrarse
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;

