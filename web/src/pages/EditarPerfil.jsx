import logoPaLaOlla from "../assets/img/logo.png";
import React, { useState, useEffect } from "react";

const baseUrl = "http://localhost:3305/";

export default function EditarPerfil() {
  const [user, setUser] = useState(null);

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
      direccion: formData.get("direccion"),
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
        direccion: data.direccion,
        password : data.password,
      };

      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
      setUser(usuarioActualizado);

      alert("Datos actualizados con éxito");
      window.location.href = "/Perfil";

    } catch (error) {
      console.error("Error en la actualizacion:", error);
      alert("Hubo un error actualizando los datos. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-amber-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="flex flex-col items-center mb-6">
          <button className="self-start text-sm text-red-800 mb-2 cursor-pointer" onClick={() => window.location.href = '/Perfil'}>&larr; Volver</button>
          <img src={logoPaLaOlla} alt="Logo Pa' la olla" className="w-16 h-16 mb-2" />
          <h1 className="text-2xl font-bold text-red-800">Pa' la olla</h1>
          <p className="text-base text-red-700 mt-2">Actualizar datos</p>
          <p className="text-sm text-gray-500 text-center">
            Puedes dejar el campo de la contraseña vacío si no deseas cambiarla.
            Si deseas cambiarla, coloca la nueva.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
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
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
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
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
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
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
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
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-800">
                Ubicación *
              </label>
              <input
                defaultValue={user?.direccion}
                name="direccion"
                type="text"
                placeholder="Ej. Don Bosco/Robles Sur Calle 18"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
            >
              Actualizar datos
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
