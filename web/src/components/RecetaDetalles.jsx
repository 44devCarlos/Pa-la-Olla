import { Button } from "../components/button";
import { RecetaEstadisticas } from "../components/RecetaEstadisticas";

export function RecetaDetalles({ receta, calificaciones, setMostrarOverlay }) {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="flex h-[31rem] flex-col items-center justify-center">
        <img
          src={receta.imagen_receta}
          alt={receta.nombre_receta}
          className="h-full w-full rounded-t-xl object-cover shadow-2xl"
        />
      </div>

      <div className="flex flex-col items-start justify-center">
        <h1 className="mb-6 text-5xl font-bold text-red-900">
          {receta.nombre_receta}
        </h1>
        <p className="mb-4 leading-8 text-red-800">
          {receta.descripcion_receta}
        </p>

        {/* Información de Alérgenos */}
        <div className="flex w-full flex-col items-center justify-center gap-y-4">
          <Button className={"flex self-baseline font-semibold text-red-900"}>
            📋 Información de Alérgenos
          </Button>
          <span className="self-start rounded-full border bg-red-500/20 px-2 text-sm font-semibold text-red-900">
            {receta.alergenos_receta}
          </span>

          <Button
            className={
              "mt-4 h-10 w-full cursor-pointer rounded-md bg-[#F21B4E] font-semibold text-white hover:bg-red-800"
            }
            onClick={() => setMostrarOverlay(true)}
          >
            🛒 Ordenar Ahora
          </Button>
        </div>

        {/* Información de la receta */}
        <RecetaEstadisticas receta={receta} calificaciones={calificaciones} />
      </div>
    </section>
  );
}
