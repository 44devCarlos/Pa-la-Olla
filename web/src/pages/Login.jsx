import logoPaLaOlla from "../assets/img/logo.png";
export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-amber-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="flex flex-col items-center mb-6">
          <button className="self-start text-sm text-red-800 mb-2">&larr; Volver</button>
          <img src={logoPaLaOlla} alt="Logo Pa' la olla" className="w-16 h-16 mb-2" />
          <h1 className="text-2xl font-bold text-red-800">Pa' la olla</h1>
          <p className="text-base text-red-700 mt-2">Iniciar Sesión</p>
          <p className="text-sm text-gray-500 text-center">
            Entra a tu cuenta para hacer pedidos
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-center text-xl font-semibold text-red-800 mb-4">
            Bienvenido de vuelta
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-red-800">
                Email
              </label>
              <input
                type="email"
                placeholder="tu@email.com"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-800">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Tu contraseña"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition"
            >
              Iniciar Sesión
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-red-600 font-medium">
              Regístrate aquí
            </a>
          </p>
          <div className="text-center text-xs text-yellow-700 mt-2 bg-yellow-100 rounded p-2">
            Demo: Usa cualquier email y contraseña de 6+ caracteres
          </div>
        </div>
      </div>
    </div>
  );
}