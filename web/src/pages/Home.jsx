import React from "react";
import { useState, useEffect } from "react";
import RecetasPopulares from "../components/RecetasPopulares";
import FiltrosIngredientes from "../components/FiltrosIngredientes";
const baseUrl = "http://localhost:3305/";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [todasLasRecetas, setTodasLasRecetas] = useState([]);

  useEffect(() => {
    fetch(baseUrl + "receta/todas")
      .then((res) => res.json())
      .then((data) => setTodasLasRecetas(data))
      .catch((err) =>
        console.error("Error al obtener todas las recetas:", err),
      );
  }, []);

  const [populares, setPopulares] = useState([]);

  useEffect(() => {
    fetch(baseUrl + "receta/recetasPopulares")
      .then((res) => res.json())
      .then((data) => setPopulares(data));
  }, []);

  const filtrarRecetas = (recetasFiltradas) => {
    setTodasLasRecetas(recetasFiltradas);
  };

  const handleVerReceta = (receta) => {
    navigate(`/descripcion/${receta.nombre_receta}`, { state: { receta } });
  };

  return (
    <>
      <RecetasPopulares recetasPopulares={populares} />
      <section className="bg-white px-6 py-10">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-red-700 md:text-2xl">
            Todas las Recetas
          </h2>
        </div>
        <FiltrosIngredientes onFiltrar={filtrarRecetas} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {todasLasRecetas.map((receta) => (
            <div
              key={receta.id_receta}
              className="group overflow-hidden rounded-lg bg-[#FFF1E7] shadow-md transition-all duration-300 ease-in-out hover:shadow-xl"
            >
              <img
                src={receta.imagen_receta}
                alt={receta.nombre_receta}
                className="h-40 w-full rounded object-cover transition-transform duration-300 group-hover:scale-110"
              />

              <div className="p-4 transition-transform duration-300 group-hover:-translate-y-2">
                <h3 className="mt-2 font-semibold text-red-700">
                  {receta.nombre_receta}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {receta.descripcion_receta}
                </p>

                <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
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
                  <button
                    className="w-full cursor-pointer rounded bg-red-600 py-2 font-semibold text-white transition hover:bg-red-700"
                    onClick={() => handleVerReceta(receta)}
                  >
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
