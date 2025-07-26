import logoPaLaOlla from "../assets/img/logo.png";
const baseUrl = "http://localhost:3305/";
export default function Login() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    console.log("Datos enviados:", data);

    try {
      const response = await fetch(baseUrl + "usuario/consultarUsuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Verifica el correo o la contraseña",
        );
      }

      const resultado = await response.json();
      console.log("Respuesta del servidor:", resultado);
      alert("Inicio de sesion exitoso");
      localStorage.setItem("usuario", JSON.stringify(resultado));
      window.location.href = "/";
    } catch (error) {
      console.error("Error en el login:", error);
      alert(
        "Hubo un error al iniciar sesión. Verifica el correo o la contraseña.",
      );
    }
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-neutral-50 to-amber-50">
      <div className="w-full max-w-md px-6">
        <div className="mb-6 flex flex-col items-center">
          <button
            className="mb-2 self-start text-sm text-red-800"
            onClick={() => (window.location.href = "/")}
          >
            &larr; Volver
          </button>
          <img
            src={logoPaLaOlla}
            alt="Logo Pa' la olla"
            className="mb-2 h-16 w-16"
          />
          <h1 className="text-2xl font-bold text-red-800">Pa' la olla</h1>
          <p className="mt-2 text-base text-red-700">Iniciar Sesión</p>
          <p className="text-center text-sm text-gray-500">
            Entra a tu cuenta para hacer pedidos
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-center text-xl font-semibold text-red-800">
            Bienvenido de vuelta
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-red-800">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="tu@email.com"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-red-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-800">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                placeholder="Tu contraseña"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-red-300 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="cursor-pointer w-full rounded-md bg-red-600 py-2 text-white transition hover:bg-orange-700"
            >
              Iniciar Sesión
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="font-medium text-red-600">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
