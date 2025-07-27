import { useNavigate } from "react-router-dom";
function RecetasPopulares({ recetasPopulares }) {
  const navigate = useNavigate();
  const handleVerReceta = (receta) => {
    navigate(`/descripcion/${receta.nombre_receta}`, { state: { receta } });
  };

  if (!recetasPopulares || recetasPopulares.length === 0) {
    return (
      <section className="p-6 text-center">
        <h2 className="mb-4 text-2xl font-bold text-red-700">
          Recetas Principales
        </h2>
        <p className="text-gray-500">No hay recetas disponibles aún.</p>
      </section>
    );
  }

  return (
    <section className="bg-[#FFF1E7] px-6 py-10">
      <div className="mb-6 text-center">
        <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-bold tracking-wide text-white uppercase">
          Para ti
        </span>
        <h2 className="mt-2 text-xl font-bold text-red-700 md:text-2xl">
          Recetas Populares
        </h2>
      </div>

      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto">
        {recetasPopulares.map((receta) => (
          <div
            key={receta.id_receta}
            className="group min-w-[300px] snap-center overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-xl"
          >
            <img
              src={receta.imagen_receta}
              alt={receta.nombre_receta}
              className="h-40 w-full rounded-t-md object-cover transition-transform duration-300 group-hover:scale-110"
            />

            <div className="p-4 transition-transform duration-300 group-hover:-translate-y-2">
              <h3 className="mt-2 font-semibold text-red-700">
                {receta.nombre_receta}
              </h3>
              <p className="line-clamp-2 text-sm text-gray-500">
                {receta.descripcion_receta}
              </p>
              <button
                className="w-full cursor-pointer rounded bg-red-600 py-1 font-semibold text-white transition hover:bg-red-700"
                onClick={() => handleVerReceta(receta)}
              >
                Ver Receta
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecetasPopulares;
