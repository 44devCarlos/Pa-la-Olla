import StarRating from "../components/StarRating.jsx";
import {FaStar} from "react-icons/fa";

export default function ListaComentarios({ comentarios, calificaciones }) {
  return (
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
                <p className="font-semibold">{comentario.nombre_usuario}</p>
                <span className="text-sm">
                  <StarRating
                    value={comentario.calificacion}
                    readOnly
                    tamaño={18}
                  />
                </span>
                <div className="w-20 text-left sm:w-auto">
                  <span className="ml-2 text-sm break-words whitespace-normal">
                    {new Date(comentario.fecha_comentario).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <span className="ml-10 inline-block rotate-90 rounded-full border border-yellow-500 px-2 py-3 text-sm transition-all duration-300 sm:ml-0 sm:-rotate-0 sm:py-0">
              <span className="inline-block w-10 -rotate-90 transition-all duration-300 sm:rotate-0 sm:py-1">
                {parseFloat(comentario.calificacion).toFixed(1)}
                <FaStar className="inline-block text-yellow-500" size={18} />
              </span>
            </span>
          </div>
          <p className="text-sm text-gray-600">{comentario.descripcion}</p>
        </div>
      ))}
    </div>
  );
}
