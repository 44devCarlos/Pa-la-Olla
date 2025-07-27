import { useEffect } from "react";
import {Button} from "./button";
import StarRating from "./StarRating.jsx";

export default function FormularioComentario({ receta, usuario, setValor, handleSubmit }) {

  useEffect(() => {
    const cajaComentario = document.getElementById("cajaComentario");
    if (cajaComentario) {
      cajaComentario.value = ""; // Limpiar el campo de comentario al cargar el componente
    }
  }, [receta.id_receta]);

  return (
    <>
      <div className="mb-6 w-[70%] rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-2 text-xl font-medium">Deja tu Comentario</h3>
        {usuario ? (
          <div className="flex flex-col gap-x-2">
            <textarea
              id="cajaComentario"
              className="mb-2 w-full rounded border p-2"
              placeholder={`Cuéntanos qué te pareció ${receta.nombre_receta}...`}
            />
            <label className="font-semibold">Calificación:</label>
            <StarRating onChange={(value) => setValor(value)} />
            <Button
              className={
                "w-full cursor-pointer rounded-full bg-red-900 py-2 font-semibold text-white"
              }
              onClick={handleSubmit}
            >
              Enviar Comentario
            </Button>
          </div>
        ) : (
          <p className="text-sm text-red-600 font-semibold">
            Debes iniciar sesión para dejar un comentario.
          </p>
        )}
      </div>
    </>
  );
}
