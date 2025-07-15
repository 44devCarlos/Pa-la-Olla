import { Link } from "react-router-dom";

const Calentar = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-yellow-100 text-rose-900 flex flex-col">

      {/* Contenido */}
      <main className="flex-grow px-4 py-10 max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
          Sancocho Panameño – <span className="text-rose-700">Listo para Calentar</span>
        </h1>
        <p className="text-center text-rose-900/80 mb-6">
          Tu comida ya está preparada. Solo necesitas calentarla y ¡a disfrutar!
        </p>

        <div className="bg-white border border-gray-200 rounded-lg shadow p-6 space-y-6">
          {/* Título */}
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded text-sm font-medium flex items-start gap-2">
            <span className="text-lg">⚡</span>
            Instrucciones de Calentamiento
          </div>

          {/* Microondas */}
          <div>
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <span className="text-red-500 text-lg">🍽️</span> Microondas (Recomendado)
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-rose-900">
              <li>
                Remueve la tapa del envase y haz pequeños agujeros con un tenedor
              </li>
              <li>
                Calienta en potencia alta por <strong>2-3 minutos</strong>
              </li>
              <li>
                Revuelve bien y calienta 1 minuto más si es necesario
              </li>
              <li>
                Deja reposar 30 segundos antes de servir
              </li>
            </ol>
          </div>

          {/* Estufa */}
          <div>
            <h2 className="text-base font-semibold mb-2">Alternativa: Estufa</h2>
            <p className="text-sm text-rose-900 bg-gray-100 border border-gray-200 p-3 rounded leading-relaxed">
              <strong>Sartén:</strong> Vacía el contenido en una sartén a fuego medio-bajo, agrega una
              cucharada de agua y calienta por 3–5 minutos revolviendo ocasionalmente.
            </p>
          </div>

          {/* Consejos */}
          <div className="bg-red-50 border border-red-200 text-rose-900 p-4 rounded text-sm space-y-2">
            <div className="font-semibold mb-1 flex items-center gap-2 text-red-600">
              ⚠️ Consejos Importantes
            </div>
            <ul className="list-disc list-inside space-y-1">
              <li>Asegúrate que esté bien caliente antes de servir</li>
              <li>Ten cuidado al retirar del microondas, puede estar muy caliente</li>
              <li>Si queda algo seco, agrega un poco de agua o caldo</li>
              <li>Consume inmediatamente después de calentar</li>
            </ul>
          </div>

          {/* Final */}
          <div className="bg-orange-100 border border-orange-200 text-orange-900 px-4 py-3 rounded text-center font-semibold text-base">
            ¡Calienta y a Comer! 🍽️ <br />
            <span className="block text-sm font-normal mt-1">
              Tu deliciosa comida panameña está lista en minutos. ¡Que lo disfrutes!
            </span>
          </div>
        </div>

        {/* Botones */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button className="border border-rose-900 text-rose-900 px-5 py-2 rounded hover:bg-rose-900 hover:text-white text-sm">
            Ver Descripción de la Receta
          </button>
          <Link to="/">
            <button className="bg-rose-900 text-white px-5 py-2 rounded hover:bg-rose-800 text-sm">
              Explorar Más Recetas
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Calentar;
