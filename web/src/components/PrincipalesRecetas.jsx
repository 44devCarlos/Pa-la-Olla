function PrincipalesRecetas({ recetasPrincipales }) {
  if (!recetasPrincipales || recetasPrincipales.length === 0) {
    return (
      <section className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Recetas Principales</h2>
        <p className="text-gray-500">No hay recetas disponibles aún.</p>
      </section>
    );
  }

  return (
    <section className="bg-[#FFF1E7] py-10 px-6">
      <div className="text-center mb-6">
        <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full uppercase tracking-wide font-bold">
          Para ti
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-red-700 mt-2">
          Principales Recetas
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto">
        {recetasPrincipales.map((receta) => (
          <div
            key={receta.id_receta}
            className="min-w-[300px] bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-xl"
          >
            <img
              src={receta.imagen_receta}
              alt={receta.nombre_receta}
              className="w-full h-40 object-cover rounded transition-transform duration-300 group-hover:scale-110"
            />

            <div className="p-4 transition-transform duration-300 group-hover:-translate-y-2">
              <h3 className="font-semibold mt-2 text-red-700">{receta.nombre_receta}</h3>
              <p className="text-sm text-gray-500">{receta.descripcion_receta}</p>
              <p className="mt-2 text-red-600 font-bold">${receta.rango_precio}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PrincipalesRecetas;