import StarRating from "../components/StarRating.jsx";
import RatingBar from "../components/RatingBar.jsx";
import FormularioComentario from "./FormularioComentario.jsx";
import ListaComentarios from "./ListaComentarios.jsx";

export default function SeccionComentarios({ calificaciones, comentarios, receta, usuario, setValor, handleSubmit }) {
  return (
    <>
      <section className="mt-12 flex flex-col items-center justify-center gap-y-6 text-red-900">
        <div className="flex w-[70%] flex-col items-center justify-center gap-x-4">
          <h2 className="mb-4 self-start text-2xl font-semibold">
            Comentarios y Calificaciones
          </h2>
          <div className="flex w-full items-center justify-center gap-x-4 px-2 pb-10 shadow-lg">
            <div className="rounded-xl p-4 text-center shadow">
              <p className="text-3xl font-bold text-orange-600">
                {parseFloat(calificaciones.calificacion_promedio).toFixed(1) !==
                "NaN"
                  ? parseFloat(calificaciones.calificacion_promedio).toFixed(1)
                  : 0}
              </p>
              <StarRating
                value={calificaciones.calificacion_promedio}
                readOnly
              />
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

        {/* Caja de comentarios */}
        <FormularioComentario
          receta={receta}
          usuario={usuario}
          setValor={setValor}
          handleSubmit={handleSubmit}
        />

        {/* Lista de comentarios */}
        <ListaComentarios comentarios={comentarios} calificaciones={calificaciones} />
      </section>
    </>
  );
}
