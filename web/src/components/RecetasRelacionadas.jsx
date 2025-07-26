import { Card, CardContent } from "./Card";
import { Button } from "./button";

export function RecetasRelacionadas({ todasLasRecetas, handleVerReceta }) {
  return (
    <>
      <h2 className="mt-10 mb-4 text-2xl font-bold text-red-900">
        Otras Recetas que te Podrían Gustar
      </h2>
      <section className="flex snap-x snap-mandatory items-center gap-x-4 overflow-x-scroll scroll-smooth transition-transform duration-300">
        {todasLasRecetas.slice(0, 4).map((r, i) => (
          <Card
            key={i}
            className="group w-[100%] flex-shrink-0 snap-center rounded-md p-4 transition-shadow duration-100 hover:shadow-xl/10 md:w-[35%]"
          >
            <div className="overflow-hidden">
              <img
                src={r.imagen_receta}
                alt={r.nombre_receta}
                className="h-56 w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <CardContent className="py-4 text-red-900">
              <h3 className="mb-1 text-lg font-bold text-red-900 group-hover:text-orange-700">
                {r.nombre_receta}
              </h3>
              <p className="line-clamp-2 text-sm">{r.descripcion_receta}</p>
              <div className="mt-2 flex flex-row justify-between">
                <p className="text-sm">⏱️ {r.rango_tiempo}</p>
                <p className="text-sm">⏱️ {r.rango_porciones}</p>
                <p className="mb-2 text-sm text-orange-700">
                  💵 {r.rango_precio}
                </p>
              </div>
              <Button
                className={
                  "w-full cursor-pointer rounded-md border py-1 text-orange-700 hover:bg-orange-700 hover:font-semibold hover:text-white"
                }
                onClick={() => handleVerReceta(r)}
              >
                Ver Receta
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
