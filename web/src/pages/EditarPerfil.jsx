import logoPaLaOlla from "../assets/img/logo.png";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import MensajeDeAlerta from "../components/MensajeDeAlerta";
import { Button } from "../components/button";

const baseUrl = "http://localhost:3305/";

export default function EditarPerfil() {
  const [user, setUser] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mensajeError, setMensajeError] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUser(JSON.parse(usuarioGuardado));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get("password");

    const data = {
      id_usuario: user?.id_usuario,
      nombre: formData.get("nombre"),
      email: formData.get("email"),
      telefono: formData.get("telefono"),
    };

    // Solo incluir la contraseña si fue escrita
    if (password && password.trim() !== "") {
      data.password = password;
    }

    console.log("Datos enviados:", data);

    try {
      const response = await fetch(baseUrl + "usuario/actualizarUsuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar usuario");
      }

      const resultado = await response.json();
      console.log("Respuesta del servidor:", resultado);

      // Actualizar el usuario en localStorage correctamente
      const usuarioActualizado = {
        ...user,
        nombre_usuario: data.nombre,
        email: data.email,
        telefono: data.telefono,
        password: data.password,
      };

      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
      setUser(usuarioActualizado);

      setMensaje("Datos actualizados con éxito");
    } catch (error) {
      console.error("Error en la actualizacion:", error);
      setMensajeError(
        "Hubo un error actualizando los datos. Inténtalo de nuevo.",
      );
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-neutral-50 to-amber-50">
      <div className="w-full max-w-md px-6">
        <div className="mb-6 flex flex-col items-center">
          <button
            className="mb-2 cursor-pointer self-start text-sm text-red-800"
            onClick={() => (window.location.href = "/Perfil")}
          >
            &larr; Volver
          </button>
          <img
            src={logoPaLaOlla}
            alt="Logo Pa' la olla"
            className="mb-2 h-16 w-16"
          />
          <h1 className="text-2xl font-bold text-red-800">Pa' la olla</h1>
          <p className="mt-2 text-base text-red-700">Actualizar datos</p>
          <p className="text-center text-sm text-gray-500">
            Puedes dejar el campo de la contraseña vacío si no deseas cambiarla.
            Si deseas cambiarla, coloca la nueva.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-red-800">
                Nombre completo *
              </label>
              <input
                defaultValue={user?.nombre_usuario}
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
                defaultValue={user?.email}
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
                defaultValue={user?.telefono}
                name="telefono"
                type="tel"
                placeholder="+507 1234-5678"
                required
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
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-red-300 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer rounded-md bg-red-600 py-2 text-white transition hover:bg-red-700"
            >
              Actualizar datos
            </button>
          </form>
        </div>
      </div>
      {/* Mensaje de alerta */}
      {(mensaje || mensajeError) && (
        <MensajeDeAlerta
          estilo={"bg-white"}
          contenido={
            <div className="flex flex-col items-center">
              <p>{mensaje || mensajeError}</p>
              {!error ? (
                <Link to="/Perfil">
                  <Button
                    className={
                      "mt-2 cursor-pointer rounded bg-red-600 p-2 font-semibold text-white transition hover:bg-red-700"
                    }
                    onClick={() => setMensaje(null)}
                  >
                    Aceptar
                  </Button>
                </Link>
              ) : (
                <Button
                  className={
                    "mt-2 cursor-pointer rounded bg-red-600 p-2 font-semibold text-white transition hover:bg-red-700"
                  }
                  onClick={() => {
                    setMensajeError("");
                    setError(false);
                  }}
                >
                  Aceptar
                </Button>
              )}
            </div>
          }
        />
      )}
    </div>
  );
}
