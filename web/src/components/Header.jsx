import logoPaLaOlla from "../assets/img/logo.png";
import iconoUsuario from "../assets/img/user.png";
function Header({ user }) {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
      {/* Logo y Nombre */}
      <div className="flex items-center gap-2">
        <img src={logoPaLaOlla} alt="Logo" className="w-6 h-6" />
        <span className="font-bold text-red-800 text-lg">Pa' la olla</span>
      </div>

      {/* Botones dependiendo del estado de sesión */}
      <div className="flex items-center gap-4">
        {user ? (
          // Usuario autenticado
          <button className="flex items-center gap-2 border border-red-600 rounded-md px-4 py-2 transition-all duration-200 hover:bg-red-600 group">
            <img
              src={iconoUsuario}
              alt="Usuario"
              className="w-6 h-6 group-hover:filter group-hover:invert group-hover:brightness-0 group-hover:contrast-100"
            />
            <span className="font-bold text-red-600 group-hover:text-white">
              {user.name}
            </span>
          </button>
        ) : (
          // Usuario no autenticado
          <>
            <button className="flex items-center gap-2 px-4 py-2 border border-orange-600 rounded-md text-orange-600 hover:bg-orange-50 font-semibold transition-all duration-150">
              <span className="text-lg">↦</span>
              Iniciar Sesión
            </button>

            <button className="bg-[#e91e63] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#c2185b] transition-colors duration-150">
              Registrarse
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
