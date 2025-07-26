import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoPaLaOlla from "../assets/img/logo.png";
const baseUrl = "http://localhost:3305/";

export default function Register() {
  const [terminosAceptados, setTerminosAceptados] = useState(false);
  const [privacidadAceptada, setPrivacidadAceptada] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!terminosAceptados || !privacidadAceptada) {
      alert(
        "Debes aceptar los Términos y Condiciones y la Política de Privacidad para registrarte.",
      );
      return;
    }

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
      navigate("/login");
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Hubo un error al crear la cuenta. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-neutral-50 to-amber-50 py-8">
      <div className="w-full max-w-md px-6">
        <div className="mb-6 flex flex-col items-center">
          <Link to="/" className="mb-2 self-start text-sm text-red-800">
            &larr; Volver
          </Link>
          <img
            src={logoPaLaOlla}
            alt="Logo Pa' la olla"
            className="mb-2 h-16 w-16"
          />
          <h1 className="text-2xl font-bold text-red-800">Pa' la olla</h1>
          <p className="mt-2 text-base text-red-700">Crear Cuenta</p>
          <p className="text-center text-sm text-gray-500">
            Únete a Pa' la olla y disfruta las mejores recetas
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-center text-xl font-semibold text-red-800">
            Registrarse
          </h2>
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
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-red-300 focus:outline-none"
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
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-red-300 focus:outline-none"
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
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-red-300 focus:outline-none"
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
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-red-300 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="terminos"
                  name="terminos"
                  type="checkbox"
                  checked={terminosAceptados}
                  onChange={(e) => setTerminosAceptados(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label
                  htmlFor="terminos"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Acepto los{" "}
                  <Link
                    to="/terminos-y-condiciones"
                    rel="noopener noreferrer"
                    className="font-medium text-red-600 hover:text-red-700"
                  >
                    Términos y Condiciones
                  </Link>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="privacidad"
                  name="privacidad"
                  type="checkbox"
                  checked={privacidadAceptada}
                  onChange={(e) => setPrivacidadAceptada(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label
                  htmlFor="privacidad"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Acepto la{" "}
                  <Link
                    to="/politica-de-privacidad"
                    rel="noopener noreferrer"
                    className="font-medium text-red-600 hover:text-red-700"
                  >
                    Política de Privacidad
                  </Link>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={!terminosAceptados || !privacidadAceptada}
              className="w-full cursor-pointer rounded-md bg-red-600 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Crear Cuenta
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta? {/* 7. Cambiar <a> por <Link> */}
            <Link to="/login" className="font-medium text-red-600">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
