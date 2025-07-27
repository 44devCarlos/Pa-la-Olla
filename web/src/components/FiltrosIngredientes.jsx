import React, { useEffect, useState } from "react";

const baseUrl = "http://localhost:3305/";

function FiltrosIngredientes({ onFiltrar }) {
  const [ingredientes, setIngredientes] = useState([]);
  const [seleccionado, setSeleccionado] = useState("Todos");

  useEffect(() => {
    fetch(baseUrl + "receta/ingredientesPrincipales")
      .then((res) => res.json())
      .then((data) => setIngredientes(data))
      .catch((err) => console.error("Error al cargar ingredientes:", err));
  }, []);

  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto bg-[#FFF1E7] px-6 py-4">
      {/* Botón "Todos" */}
      <button
        onClick={() => {
          setSeleccionado("Todos");
          fetch(baseUrl + "receta/todas")
            .then((res) => res.json())
            .then((data) => onFiltrar(data))
            .catch((err) =>
              console.error("Error al obtener todas las recetas:", err),
            );
        }}
        className={`cursor-pointer rounded-full border ${seleccionado === "Todos" ? "bg-red-800 text-white" : "bg-transparent text-red-600"} px-4 py-2 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white`}
      >
        Todos
      </button>

      {/* Botones por ingrediente */}
      {ingredientes.map((ing, index) => (
        <button
          key={index}
          onClick={() => {
            setSeleccionado(ing.ingrediente_principal);
            fetch(
              baseUrl +
                `receta/filtrarPorIngrediente?ingrediente=${ing.ingrediente_principal}`,
            )
              .then((res) => res.json())
              .then((data) => onFiltrar(data))
              .catch((err) => console.error("Error al filtrar:", err));
          }}
          className={`${seleccionado === ing.ingrediente_principal ? "bg-red-800 text-white" : "bg-transparent text-red-600"} cursor-pointer rounded-full border border-red-600 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white`}
        >
          {ing.ingrediente_principal}
        </button>
      ))}
    </div>
  );
}

export default FiltrosIngredientes;
