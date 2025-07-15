import { Link } from "react-router-dom";

const Perfil = () => {
  return (
    <div className="min-h-screen bg-neutral-50 text-rose-900">
     
      {/* Perfil principal */}
      <section className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
          JR
        </div>
        <h1 className="text-3xl font-bold mb-2">Jaider Rico</h1>
        <p className="text-rose-900/70 mb-4">Miembro desde 1 de enero de 2024</p>
        <span className="inline-block bg-yellow-500 text-white px-3 py-1 rounded text-sm">
          Cliente Activo
        </span>
      </section>

      {/* Contenido */}
      <section className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
        {/* Columna izquierda */}
        <div>
          {/* Información personal */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow space-y-4">
            <h2 className="text-lg font-semibold">Información Personal</h2>
            <p className="text-sm">Correo: jaider@example.com</p>
            <p className="text-sm">Teléfono: 12345678</p>
            <p className="text-sm">Dirección: Ciudad de Panamá</p>
            <p className="text-sm">Miembro desde 1 de enero de 2024</p>
          </div>

          {/* Estadísticas */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow space-y-4">
            <h2 className="text-lg font-semibold">Estadísticas</h2>
            <div className="flex justify-between">
              <span>Pedidos</span>
              <span className="border border-yellow-400 px-2 py-1 rounded text-sm">12</span>
            </div>
            <div className="flex justify-between">
              <span>Favoritas</span>
              <span className="border border-pink-400 px-2 py-1 rounded text-sm">8</span>
            </div>
            <div className="flex justify-between">
              <span>Reseñas</span>
              <span className="border border-yellow-400 px-2 py-1 rounded text-sm">5</span>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pedidos recientes */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow space-y-4">
            <h2 className="text-lg font-semibold mb-4">Pedidos Recientes</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-semibold">Sancocho Panameño</h4>
                  <p className="text-sm text-rose-900/70">Pedido #PA001 • 15 de enero de 2024</p>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Entregado</span>
                  <button className="border border-orange-500 text-orange-500 px-3 py-1 rounded text-sm hover:bg-orange-500 hover:text-white">
                    Ver Detalles
                  </button>
                </div>
              </div>
              {/* Puedes duplicar este bloque para más pedidos */}
            </div>
            <div className="text-center mt-6">
              <button className="border border-rose-900 text-rose-900 px-4 py-2 rounded hover:bg-rose-900 hover:text-white">
                Ver Todos los Pedidos
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/">
              <button className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-rose-900">
                Explorar Recetas
              </button>
            </Link>
            <button className="w-full border border-pink-500 text-pink-500 px-4 py-2 rounded hover:bg-pink-500 hover:text-white">
              Editar Perfil
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Perfil;
