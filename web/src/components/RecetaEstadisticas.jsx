export function RecetaEstadisticas({ receta, calificaciones }) {
    return (
      <div className="mt-5 flex h-26 w-[85%] items-center justify-center gap-x-1 self-center rounded-xl bg-white pb-4 text-sm text-orange-700 sm:gap-x-14 md:mb-2 md:w-[90%] md:gap-x-6 lg:gap-x-14">
        <div className="flex flex-col items-center">
          <span>📋</span>
          <span>Tiempo</span>
          <span className="font-bold text-red-800">{receta.rango_tiempo}</span>
        </div>
        <div className="flex flex-col items-center">
          <span>📋</span>
          <span>Porciones</span>
          <span className="font-bold text-red-800">
            {receta.rango_porciones}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span>📋</span>
          <span>Rating</span>
          <span className="font-bold text-red-800">
            {parseFloat(calificaciones.calificacion_promedio).toFixed(1) !==
            "NaN"
              ? parseFloat(calificaciones.calificacion_promedio).toFixed(1)
              : 0}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span>📋</span>
          <span>Precio</span>
          <span className="font-bold text-red-800">{receta.rango_precio}</span>
        </div>
      </div>
    );
}