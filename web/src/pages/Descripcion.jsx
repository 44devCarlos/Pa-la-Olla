import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/Card";
import { Button } from "../components/button";
import RatingBar from "../components/RatingBar";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function Descripcion() {
  const baseUrl = "http://localhost:3305/";
  const location = useLocation();
  const navigate = useNavigate();
  const nombre_receta = useParams().nombreReceta;
  const { receta } = location.state || {};
  const [todasLasRecetas, setTodasLasRecetas] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);

  useEffect(() => {
    fetch(baseUrl + "receta/todas")
      .then((res) => res.json())
      .then((data) => setTodasLasRecetas(data))
      .catch((err) =>
        console.error("Error al obtener todas las recetas:", err),
      );

    fetch(baseUrl + `receta/comentarios/${receta.id_receta}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data) {
          console.error("Receta no encontrada");
          return;
        }
        setComentarios(data);
      })
      .catch((err) => console.error("Error al obtener la receta:", err));

    fetch(baseUrl + `receta/calificaciones/${receta.id_receta}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data) {
          console.error("Receta no encontrada");
          return;
        }
        setCalificaciones(data[0]);
        console.log("Calificaciones:", data[0]);
      })
      .catch((err) => console.error("Error al obtener la receta:", err));
  }, [receta.id_receta]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [nombre_receta]);

  function barajear(recetas) {
    for (let i = recetas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [recetas[i], recetas[j]] = [recetas[j], recetas[i]]; // intercambio
    }
    return recetas;
  }

  const handleVerReceta = (receta) => {
    navigate(`/descripcion/${receta.nombre_receta}`, { state: { receta } });
  };

  return (
    <main>
      <section className="mx-auto max-w-screen-xl p-2 md:p-6">
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex h-[31rem] flex-col items-center justify-center">
            <img
              src={receta.imagen_receta}
              alt="Sancocho Panameño"
              className="h-[90%] w-full rounded-t-xl shadow-2xl"
            />
          </div>

          <div className="flex flex-col items-start justify-center">
            <h1 className="mb-6 text-5xl font-bold text-red-900">
              {receta.nombre_receta}
            </h1>
            <p className="mb-4 leading-8 text-red-800">
              {receta.descripcion_receta}
            </p>

            <div className="flex w-full flex-col items-center justify-center gap-y-4">
              <Button
                className={"flex self-baseline font-semibold text-red-900"}
              >
                📋 Información de Alérgenos
              </Button>
              <span className="self-start rounded-full border bg-red-500/20 px-2 text-sm font-semibold text-red-900">
                {receta.alergenos_receta}
              </span>
              <Button
                className={
                  "mt-4 h-10 w-full cursor-pointer rounded-md bg-[#F21B4E] font-semibold text-white hover:bg-red-800"
                }
              >
                🛒 Ordenar Ahora
              </Button>
            </div>
            <div className="mt-5 flex h-26 w-[85%] items-center justify-center gap-x-1 self-center rounded-xl bg-white pb-4 text-sm text-orange-700 sm:gap-x-14 md:mb-2 md:w-[90%] md:gap-x-6 lg:gap-x-14">
              <div className="flex flex-col items-center">
                <span>📋</span>
                <span>Tiempo</span>
                <span className="font-bold text-red-800">
                  {receta.rango_tiempo}
                </span>
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
                  {parseFloat(calificaciones.calificacion_promedio).toFixed(
                    1,
                  ) !== "NaN"
                    ? parseFloat(calificaciones.calificacion_promedio).toFixed(
                        1,
                      )
                    : 0}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span>📋</span>
                <span>Precio</span>
                <span className="font-bold text-red-800">
                  {receta.rango_precio}
                </span>
              </div>
            </div>
          </div>
        </section>

        <h2 className="mt-10 mb-4 text-2xl font-bold text-red-900">
          Otras Recetas que te Podrían Gustar
        </h2>
        <section className="flex snap-x snap-mandatory items-center gap-x-4 overflow-x-scroll scroll-smooth transition-transform duration-300">
          {barajear(todasLasRecetas).map((r, i) => (
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
                <p className="text-sm">{r.descripcion_receta}</p>
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

        <section className="mt-12 flex flex-col items-center justify-center gap-y-6 text-red-900">
          <div className="flex w-[70%] flex-col items-center justify-center gap-x-4">
            <h2 className="mb-4 self-start text-2xl font-semibold">
              Comentarios y Calificaciones
            </h2>
            <div className="flex w-full items-center justify-center gap-x-4 px-2 pb-10 shadow-lg">
              <div className="rounded-xl p-4 text-center shadow">
                <p className="text-3xl font-bold text-orange-600">
                  {parseFloat(calificaciones.calificacion_promedio).toFixed(
                    1,
                  ) !== "NaN"
                    ? parseFloat(calificaciones.calificacion_promedio).toFixed(
                        1,
                      )
                    : 0}
                </p>
                <p className="text-xs font-bold text-yellow-500">⭐⭐⭐⭐⭐</p>
                <p className="text-sm">
                  {calificaciones.total_comentario} reseñas
                </p>
              </div>
              <div className="flex flex-col items-start justify-center gap-y-1">
                <RatingBar
                  stars={5}
                  count={calificaciones.cinco_estrellas}
                  maxCount={calificaciones.total_comentario}
                />
                <RatingBar
                  stars={4}
                  count={calificaciones.cuatro_estrellas}
                  maxCount={calificaciones.total_comentario}
                />
                <RatingBar
                  stars={3}
                  count={calificaciones.tres_estrellas}
                  maxCount={calificaciones.total_comentario}
                />
                <RatingBar
                  stars={2}
                  count={calificaciones.dos_estrellas}
                  maxCount={calificaciones.total_comentario}
                />
                <RatingBar
                  stars={1}
                  count={calificaciones.una_estrella}
                  maxCount={calificaciones.total_comentario}
                />
              </div>
            </div>
          </div>

          <div className="mb-6 w-[70%] rounded-xl bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-xl font-medium">Deja tu Comentario</h3>
            <textarea
              className="mb-2 w-full rounded border p-2"
              placeholder="Cuéntanos qué te pareció Sancocho Panameño..."
            ></textarea>
            <Button className={""}>Enviar Comentario</Button>
          </div>

          <div className="flex w-[70%] flex-col items-center justify-center space-y-4">
            <h2 className="self-start text-2xl font-semibold">
              Todos los comentarios ({calificaciones.total_comentario})
            </h2>
            {comentarios.map((comentario, i) => (
              <div key={i} className="w-full rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between gap-x-4">
                  <div className="flex items-center gap-x-2">
                    <img
                      src={`https://i.pravatar.cc/150?u=${i}`}
                      alt={comentario.nombre}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{comentario.nombre}</p>
                      <span className="text-sm">⭐⭐⭐⭐⭐</span>
                      <div className="w-20 text-left sm:w-auto">
                        <span className="ml-2 text-sm break-words whitespace-normal">
                          {comentario.fecha_comentario}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="ml-10 inline-block rotate-90 rounded-full border border-yellow-500 px-2 py-3 text-sm transition-all duration-300 sm:ml-0 sm:-rotate-0 sm:py-0">
                    <span className="inline-block -rotate-90 transition-all duration-300 sm:rotate-0">
                      {parseFloat(comentario.calificacion).toFixed(1)}⭐
                    </span>
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {comentario.descripcion}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
