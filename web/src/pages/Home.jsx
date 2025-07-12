import React from "react";
import { useState, useEffect } from "react";
import PrincipalesRecetas from "../components/PrincipalesRecetas";
import FiltrosIngredientes from "../components/FiltrosIngredientes";
const baseUrl = "http://localhost:3305/";

export default function Home() {
  const [todasLasRecetas, setTodasLasRecetas] = useState([]);

  useEffect(() => {
    fetch(baseUrl + "receta/todas")
      .then((res) => res.json())
      .then((data) => setTodasLasRecetas(data))
      .catch((err) => console.error("Error al obtener todas las recetas:", err));
  }, []);

  const [principales, setPrincipales] = useState([]);

  useEffect(() => {
    fetch(baseUrl + "receta/recetasPrincipales")
      .then((res) => res.json())
      .then((data) => setPrincipales(data));
  }, []);

  const filtrarRecetas = (recetasFiltradas) => {
    setTodasLasRecetas(recetasFiltradas);
  };

  return (
    <>
      <PrincipalesRecetas recetasPrincipales={principales} />
      <section className="bg-white py-10 px-6">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-red-700">
            Todas las Recetas
          </h2>
        </div>
          <FiltrosIngredientes onFiltrar={filtrarRecetas} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {todasLasRecetas.map((receta) => (
            <div
              key={receta.id_receta}
              className="bg-[#FFF1E7] rounded-lg shadow-md overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-xl"
            >
              <img
                src={receta.imagen_receta}
                alt={receta.nombre_receta}
                className="w-full h-40 object-cover rounded transition-transform duration-300 group-hover:scale-110"
              />

              <div className="p-4 transition-transform duration-300 group-hover:-translate-y-2">
                <h3 className="font-semibold mt-2 text-red-700">
                  {receta.nombre_receta}
                </h3>
                <p className="text-sm text-gray-600">{receta.descripcion_receta}</p>

                <div className="flex justify-between items-center mt-3 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <span>💰</span>
                    <span>{receta.rango_precio}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{receta.rango_tiempo}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👥</span>
                    <span>{receta.rango_porciones}</span>
                  </div>
                </div>

                {/* Botón Ver Receta */}
                <div className="mt-4 text-center">
                  <button className="bg-red-600 text-white font-semibold w-full py-2 rounded hover:bg-red-700 transition">
                    Ver Receta
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
