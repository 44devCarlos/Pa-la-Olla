import { Link } from "react-router-dom";

const RecetaCompleta = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-yellow-100 text-rose-900 flex flex-col">

      {/* Main */}
      <main className="flex-grow px-4 py-10 max-w-5xl mx-auto space-y-8">
        {/* Título */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Arroz con Pollo Panameño</h1>
          <p className="text-rose-900/80">Receta completa con vídeo tutorial y pasos detallados</p>
          <div className="flex justify-center gap-4 text-sm mt-2 flex-wrap">
            <span className="px-3 py-1 bg-white border border-gray-200 rounded">⏱️ 1 hora</span>
            <span className="px-3 py-1 bg-white border border-gray-200 rounded">👨‍👩‍👧‍👦 6 personas</span>
            <span className="px-3 py-1 bg-white border border-gray-200 rounded">🥄 Intermedio</span>
          </div>
        </div>

        {/* Video Tutorial */}
        <div className="bg-gradient-to-br from-rose-900 to-rose-800 text-white rounded-lg overflow-hidden shadow-md">
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold mb-2">▶️ Vídeo Tutorial</h2>
            <p className="text-xl font-semibold">Cómo preparar Arroz con Pollo Panameño</p>
            <p className="text-sm text-white/80">Vídeo paso a paso de la preparación</p>
            <button className="mt-4 bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500">
              ▶ Reproducir Video
            </button>
            <p className="mt-4 text-sm text-white/60">Duración: 1 hora • HD Quality</p>
          </div>
        </div>

        {/* Ingredientes y Pasos */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Ingredientes */}
          <div className="bg-red-50 border border-red-100 rounded-lg p-6 space-y-4 shadow">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">🍴 Ingredientes</h3>
            <ul className="space-y-2 text-sm">
              {[
                "1 pollo entero cortado en presas",
                "2 tazas de arroz",
                "4 tazas de caldo de pollo",
                "1 cebolla",
                "1 pimiento verde",
                "3 dientes de ajo",
                "1/2 taza de guisantes",
                "Azafrán o culantro para color",
                "Hojas de bijao",
                "Sal y pimienta",
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="bg-white border border-yellow-300 px-4 py-2 rounded shadow-sm"
                >
                  <span className="mr-2 font-bold text-yellow-500">{idx + 1}.</span> {item}
                </li>
              ))}
            </ul>

            <div className="bg-yellow-100 border border-yellow-300 rounded px-4 py-3 text-sm text-yellow-800 mt-4">
              🍳 <strong>Consejo del Chef:</strong><br />
              Todos los ingredientes deben estar a temperatura ambiente antes de comenzar la
              preparación para mejores resultados.
            </div>
          </div>

          {/* Pasos */}
          <div className="bg-pink-50 border border-pink-100 rounded-lg p-6 space-y-4 shadow">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">📋 Preparación Paso a Paso</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              {[
                "Sofríe el pollo hasta dorar",
                "Agregar cebolla, ajo y pimiento",
                "Incorporar el arroz y tostar ligeramente",
                "Añadir el caldo caliente y azafrán",
                "Cocinar tapado por 25 minutos",
                "Agregar guisantes en los últimos 5 minutos",
                "Decorar con hojas de bijao al servir",
              ].map((step, idx) => (
                <li key={idx} className="text-rose-900">
                  {step}
                </li>
              ))}
            </ol>

            <div className="bg-yellow-100 border border-yellow-300 px-4 py-3 rounded text-sm text-yellow-800">
              ✅ ¡Listo! Tu Arroz con Pollo Panameño está preparado para servir
            </div>
          </div>
        </div>

        {/* Consejos adicionales */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-red-600 mb-2">🍳 Técnicas de Cocción</h4>
              <ul className="list-disc list-inside space-y-1 text-rose-900">
                <li>Cocina a fuego medio para evitar que se pegue</li>
                <li>Revuelve ocasionalmente para distribución uniforme</li>
                <li>Prueba y ajusta sazón al final</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-2">🍽️ Sugerencias de Servicio</h4>
              <ul className="list-disc list-inside space-y-1 text-rose-900">
                <li>Sirve inmediatamente mientras esté caliente</li>
                <li>Acompaña con arroz blanco</li>
                <li>Decora con cilantro fresco picado</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <button className="border border-rose-900 text-rose-900 px-5 py-2 rounded hover:bg-rose-900 hover:text-white text-sm">
            Ver Descripción de la Receta
          </button>
          <Link to="/">
            <button className="bg-rose-900 text-white px-5 py-2 rounded hover:bg-rose-800 text-sm">
              Explorar Más Recetas
            </button>
          </Link>
        </div>

        {/* Compartir */}
        <p className="text-center text-sm text-rose-900/60 mt-4">
          ¿Te gustó esta receta? ¡Compártela con tu familia y amigos!
        </p>
      </main>
    </div>
  );
};

export default RecetaCompleta;
