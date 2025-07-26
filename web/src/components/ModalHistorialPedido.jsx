import { FaTimes } from "react-icons/fa";

export default function ModalHistorialPedido({
  mostrarPedidos,
  setMostrarPedidos,
  pedidos,
  verDetalles,
  setMostrarPasoPaso,
  setMostrarVideo,
  setMostrarDetallesPedido,
}) {
  return (
    <>
      {/* Historial de pedido */}
      <section
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${mostrarPedidos ? "block" : "hidden"}`}
      >
        <div className="relative flex h-140 w-250 flex-col overflow-y-scroll rounded-lg bg-white p-6 text-red-900">
          <FaTimes
            className="absolute top-5 right-5 cursor-pointer text-gray-700"
            onClick={() => setMostrarPedidos(false)}
          >
            x
          </FaTimes>
          <div className="space-y-2 px-4 py-10">
            {pedidos.length > 0 ? (
              pedidos.map((pedido) => (
                <div
                  key={pedido.id_pedido}
                  className="flex items-center justify-between rounded-lg border border-red-900/20 bg-gray-100 p-4"
                >
                  <div>
                    <h4 className="font-semibold">{pedido.nombre_receta}</h4>
                    <p className="text-sm text-rose-900/70">
                      Pedido #{pedido.id_pedido} •{" "}
                      {new Date(pedido.fecha_pedido).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className="cursor-pointer rounded border border-orange-500 bg-orange-500 px-3 py-1 text-sm text-white hover:bg-rose-900 hover:text-white"
                      onClick={() => {
                        setMostrarPasoPaso(true);
                        setMostrarVideo(true);
                        verDetalles(pedido.id_pedido);
                      }}
                    >
                      Ver Receta
                    </button>
                    <button
                      className="cursor-pointer rounded border border-orange-500 bg-orange-500 px-3 py-1 text-sm text-white hover:bg-rose-900 hover:text-white"
                      onClick={() => {
                        setMostrarDetallesPedido(true);
                        verDetalles(pedido.id_pedido);
                      }}
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-rose-900/70">
                No tienes pedidos recientes.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
