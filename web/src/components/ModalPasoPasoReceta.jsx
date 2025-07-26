import { FaTimes } from "react-icons/fa";

export default function ModalPasoPasoReceta({
  mostrarPasoPaso,
  setMostrarPasoPaso,
  setMostrarVideo,
  mostrarVideo,
  recetaActual,
}) {
  return (
    <>
      {/* Paso a paso de la receta */}
      <section
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${mostrarPasoPaso ? "block" : "hidden"}`}
      >
        <div className="relative flex h-140 w-250 flex-col overflow-y-scroll rounded-lg bg-white p-6 text-red-900">
          <FaTimes
            className="absolute top-5 right-5 cursor-pointer text-gray-700"
            onClick={() => {
              setMostrarPasoPaso(false);
              setMostrarVideo(false);
            }}
          >
            x
          </FaTimes>
          {recetaActual ? (
            recetaActual.nivel === "principiante" ? (
              <>
                <div className="mx-auto max-w-2xl flex-grow px-4 py-10">
                  <h1 className="mb-2 text-center text-2xl font-bold md:text-3xl">
                    {recetaActual ? recetaActual.nombre_receta : "Receta"} –{" "}
                    <span className="text-rose-700">Listo para Calentar</span>
                  </h1>
                  <p className="mb-6 text-center text-rose-900/80">
                    Tu comida ya está preparada. Solo necesitas calentarla y ¡a
                    disfrutar!
                  </p>

                  <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow">
                    {/* Título */}
                    <div className="flex items-start gap-2 rounded border border-yellow-300 bg-yellow-100 px-4 py-3 text-sm font-medium text-yellow-800">
                      <span className="text-lg">⚡</span>
                      Instrucciones de Calentamiento
                    </div>

                    {/* Microondas */}
                    <div>
                      <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
                        <span className="text-lg text-red-500">🍽️</span>{" "}
                        Microondas (Recomendado)
                      </h2>
                      <ol className="list-inside list-decimal space-y-2 text-sm">
                        {[
                          recetaActual.niveles[recetaActual.nivel][
                            `${recetaActual.cantidad}_personas`
                          ].paso_a_paso,
                        ].map((r) =>
                          r.map((paso_a_paso, index) => (
                            <li key={index} className="text-rose-900">
                              {paso_a_paso}
                            </li>
                          )),
                        )}
                      </ol>
                    </div>

                    {/* Estufa */}
                    <div>
                      <h2 className="mb-2 text-base font-semibold">
                        Alternativa: Estufa
                      </h2>
                      <p className="rounded border border-gray-200 bg-gray-100 p-3 text-sm leading-relaxed text-rose-900">
                        <strong>Sartén:</strong> Vacía el contenido en una
                        sartén a fuego medio-bajo, agrega una cucharada de agua
                        y calienta por 3–5 minutos revolviendo ocasionalmente.
                      </p>
                    </div>

                    {/* Consejos */}
                    <div className="space-y-2 rounded border border-red-200 bg-red-50 p-4 text-sm text-rose-900">
                      <div className="mb-1 flex items-center gap-2 font-semibold text-red-600">
                        ⚠️ Consejos Importantes
                      </div>
                      <ul className="list-inside list-disc space-y-1">
                        <li>
                          Asegúrate que esté bien caliente antes de servir
                        </li>
                        <li>
                          Ten cuidado al retirar del microondas, puede estar muy
                          caliente
                        </li>
                        <li>Consume inmediatamente después de calentar</li>
                      </ul>
                    </div>

                    {/* Final */}
                    <div className="rounded border border-orange-200 bg-orange-100 px-4 py-3 text-center text-base font-semibold text-orange-900">
                      ¡Calienta y a Comer! 🍽️ <br />
                      <span className="mt-1 block text-sm font-normal">
                        Tu deliciosa comida panameña está lista en minutos. ¡Que
                        lo disfrutes!
                      </span>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <button
                      className="cursor-pointer rounded bg-rose-900 px-5 py-2 text-lg font-bold text-white hover:bg-rose-800"
                      onClick={() => {
                        setMostrarPasoPaso(false);
                        setMostrarVideo(false);
                      }}
                    >
                      Termine
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Paso a paso Intermedio, Avanzado */}
                <div className="mx-auto max-w-5xl flex-grow space-y-8 px-4 py-10">
                  {/* Título */}
                  <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">
                      {recetaActual ? recetaActual.nombre_receta : "Receta"}
                    </h1>
                    <p className="text-rose-900/80">
                      Receta completa con vídeo tutorial y pasos detallados
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm">
                      <span className="rounded border border-gray-200 bg-white px-3 py-1">
                        👨‍👩‍👧‍👦 {recetaActual.cantidad} personas
                      </span>
                      <span className="rounded border border-gray-200 bg-white px-3 py-1">
                        🥄{" "}
                        {recetaActual
                          ? recetaActual.nivel.charAt(0).toUpperCase() +
                            recetaActual.nivel.slice(1)
                          : "Nivel"}
                      </span>
                    </div>
                  </div>

                  {/* Video Tutorial */}
                  <div className="overflow-hidden rounded-lg bg-gradient-to-br from-rose-900 to-rose-800 text-white shadow-md">
                    <div className="px-6 py-4">
                      <h2 className="mb-2 text-lg font-semibold">
                        ▶️ Vídeo Tutorial
                      </h2>
                      <p className="text-xl font-semibold">
                        Cómo preparar{" "}
                        {recetaActual ? recetaActual.nombre_receta : "Receta"}
                      </p>
                      <p className="text-sm text-white/80">
                        Vídeo paso a paso de la preparación
                      </p>
                      {mostrarVideo ? (
                        <iframe
                          src={recetaActual ? recetaActual.video : ""}
                          title="YouTube video player"
                          className="aspect-video w-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <>
                          <button
                            className="mt-4 rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                            onClick={() => setMostrarVideo(true)}
                          >
                            Ver Vídeo Tutorial
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Ingredientes y Pasos */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Ingredientes */}
                    <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-6 shadow">
                      <h3 className="mb-2 flex items-center gap-2 text-lg font-bold">
                        🍴 Ingredientes
                      </h3>
                      <ul className="space-y-2 text-sm">
                        {[
                          recetaActual.niveles[recetaActual.nivel][
                            `${recetaActual.cantidad}_personas`
                          ].ingredientes,
                        ].map((r) =>
                          r.map((ingrediente, index) => (
                            <li
                              key={index}
                              className="rounded border border-yellow-300 bg-white px-4 py-2 shadow-sm"
                            >
                              <span className="mr-2 font-bold text-yellow-500">
                                {index + 1}.
                              </span>{" "}
                              {ingrediente}
                            </li>
                          )),
                        )}
                      </ul>

                      <div className="mt-4 rounded border border-yellow-300 bg-yellow-100 px-4 py-3 text-sm text-yellow-800">
                        🍳 <strong>Consejo del Chef:</strong>
                        <br />
                        Todos los ingredientes deben estar a temperatura
                        ambiente antes de comenzar la preparación para mejores
                        resultados.
                      </div>
                    </div>

                    {/* Pasos */}
                    <div className="space-y-4 rounded-lg border border-pink-100 bg-pink-50 p-6 shadow">
                      <h3 className="mb-2 flex items-center gap-2 text-lg font-bold">
                        📋 Preparación Paso a Paso
                      </h3>
                      <ol className="list-inside list-decimal space-y-2 text-sm">
                        {[
                          recetaActual.niveles[recetaActual.nivel][
                            `${recetaActual.cantidad}_personas`
                          ].paso_a_paso,
                        ].map((r) =>
                          r.map((paso_a_paso, index) => (
                            <li key={index} className="text-rose-900">
                              {paso_a_paso}
                            </li>
                          )),
                        )}
                      </ol>

                      <div className="rounded border border-yellow-300 bg-yellow-100 px-4 py-3 text-sm text-yellow-800">
                        ✅ ¡Listo! Tu {recetaActual.nombre_receta} está
                        preparado para servir
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <button
                      className="cursor-pointer rounded bg-rose-900 px-5 py-2 text-lg font-bold text-white hover:bg-rose-800"
                      onClick={() => {
                        setMostrarPasoPaso(false);
                        setMostrarVideo(false);
                      }}
                    >
                      Termine
                    </button>
                  </div>
                </div>
              </>
            )
          ) : (
            <>
              <div className="flex flex-col items-center justify-center">
                <p className="text-lg font-semibold text-rose-900">
                  No hay pedido seleccionado.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
