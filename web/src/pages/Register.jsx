import logoPaLaOlla from "../assets/img/logo.png";
const baseUrl = "http://localhost:3305/";

export default function Register() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      nombre: formData.get("nombre"),
      email: formData.get("email"),
      telefono: formData.get("telefono"),
      password: formData.get("password"),
    };

    console.log("Datos enviados:", data);

    try {
      const response = await fetch(baseUrl + "usuario/agregarUsuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al registrar usuario");
      }

      const resultado = await response.json();
      console.log("Respuesta del servidor:", resultado);
      alert("Cuenta creada con éxito");
      window.location.href = "/login";

    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Hubo un error al crear la cuenta. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-amber-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="flex flex-col items-center mb-6">
          <button className="self-start text-sm text-red-800 mb-2">&larr; Volver</button>
          <img src={logoPaLaOlla} alt="Logo Pa' la olla" className="w-16 h-16 mb-2" />
          <h1 className="text-2xl font-bold text-red-800">Pa' la olla</h1>
          <p className="text-base text-red-700 mt-2">Crear Cuenta</p>
          <p className="text-sm text-gray-500 text-center">
            Únete a Pa' la olla y disfruta las mejores recetas
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-center text-xl font-semibold text-red-800 mb-4">Registrarse</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-red-800">
                Nombre completo *
              </label>
              <input
                name="nombre"
                type="text"
                placeholder="Tu nombre completo"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-800">
                Email *
              </label>
              <input
                name="email"
                type="email"
                placeholder="tu@email.com"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-800">
                Teléfono
              </label>
              <input
                name="telefono"
                type="tel"
                placeholder="+507 1234-5678"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-800">
                Contraseña *
              </label>
              <input
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
            >
              Crear Cuenta
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-red-600 font-medium">
              Iniciar sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
