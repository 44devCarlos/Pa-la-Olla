import {FaTimes} from "react-icons/fa";

export default function ModalDetallesPedido({ mostrarDetallesPedido, setMostrarDetallesPedido, recetaActual, user }) {
  return (
    <>
      <section
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${mostrarDetallesPedido ? "block" : "hidden"}`}
      >
        <div className="relative flex h-140 w-100 flex-col overflow-y-auto rounded-lg bg-white p-6 text-center text-red-900">
          <FaTimes
            className="absolute top-5 right-5 cursor-pointer text-gray-700"
            onClick={() => setMostrarDetallesPedido(false)}
          >
            x
          </FaTimes>
          <div className="space-y-4 px-4 py-10">
            <h3 className="mb-2 text-lg font-bold">Detalles del Pedido</h3>
            <p>Aquí puedes ver los detalles de tu pedido.</p>
            <div>
              <h4 className="text-md mt-4 font-semibold">
                Información del Cliente
              </h4>
              <p>
                <span className="font-semibold">Nombre:</span>{" "}
                {user?.nombre_usuario}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user?.email}
              </p>
              <p>
                <span className="font-semibold">Teléfono:</span>{" "}
                {user?.telefono}
              </p>
              <p>
                <span className="font-semibold">Dirección:</span>{" "}
                {recetaActual?.direccion || "No disponible"}
              </p>
              {/*Orden de paypal, nivel de la receta, nombre de receta, fecha del
              pedido, monto de pago */}
              <h4 className="text-md mt-4 font-semibold">
                Detalles del Pedido
              </h4>
              <p>
                <span className="font-semibold">ID del pedido:</span>
                {" #"}
                {recetaActual?.id_pedido}
              </p>
              <p>
                <span className="font-semibold">Orden de Paypal:</span>{" "}
                {recetaActual?.orden_paypal}
              </p>
              <p>
                <span className="font-semibold">Fecha:</span>{" "}
                {new Date(recetaActual?.fecha_pedido).toLocaleDateString(
                  "es-ES",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </p>
              <p>
                <span className="font-semibold">Nombre de la receta:</span>{" "}
                {recetaActual?.nombre_receta}
              </p>
              <p>
                <span className="font-semibold">Nivel:</span>{" "}
                {recetaActual?.nivel}
              </p>
              <p>
                <span className="font-semibold">Cantidad:</span>{" "}
                {recetaActual?.cantidad}
                {" Personas"}
              </p>
              <p>
                <span className="font-semibold">Total:</span>
                {" $"}
                {Number(recetaActual?.precio).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
