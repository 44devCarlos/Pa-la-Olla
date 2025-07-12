import React, { useEffect, useState } from "react";

const baseUrl = "http://localhost:3305/";

function FiltrosIngredientes({ onFiltrar }) {
  const [ingredientes, setIngredientes] = useState([]);

  useEffect(() => {
    fetch(baseUrl + "receta/ingredientesPrincipales")
      .then((res) => res.json())
      .then((data) => setIngredientes(data))
      .catch((err) => console.error("Error al cargar ingredientes:", err));
  }, []);

  return (
    <div className="flex flex-wrap gap-2 px-6 py-4 overflow-x-auto bg-[#FFF1E7]">
      {/* Botón "Todos" */}
      <button
        onClick={() => {
          fetch(baseUrl + "receta/todas")
            .then((res) => res.json())
            .then((data) => onFiltrar(data))
            .catch((err) => console.error("Error al obtener todas las recetas:", err));
        }}
        className="px-4 py-2 border border-red-600 text-red-600 rounded-full font-semibold hover:bg-red-600 hover:text-white transition"
      >
        Todos
      </button>

      {/* Botones por ingrediente */}
      {ingredientes.map((ing, index) => (
        <button
          key={index}
          onClick={() => {
            fetch(baseUrl + `receta/filtrarPorIngrediente?ingrediente=${ing.ingrediente_principal}`)
              .then((res) => res.json())
              .then((data) => onFiltrar(data))
              .catch((err) => console.error("Error al filtrar:", err));
          }}
          className="px-4 py-2 border border-red-600 text-red-600 rounded-full font-semibold hover:bg-red-600 hover:text-white transition"
        >
          {ing.ingrediente_principal}
        </button>
      ))}
    </div>
  );
}

export default FiltrosIngredientes;