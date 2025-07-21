import { Link } from "react-router-dom";
import iconoUsuario from "../assets/img/user.png";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const Perfil = () => {
  const baseUrl = "http://localhost:3305/";
  const [user, setUser] = useState(null);
  const [cantidadPedidos, setCantidadPedidos] = useState(0);
  const [cantidadComentarios, setCantidadComentarios] = useState(0);
  const [pedidos, setPedidos] = useState([]);
  const [mostrarPedidos, setMostrarPedidos] = useState(false);
  const [mostrarPasoPaso, setMostrarPasoPaso] = useState(false);
  const [mostrarDetallesPedido, setMostrarDetallesPedido] = useState(false);
  const [recetaActual, setRecetaActual] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUser(JSON.parse(usuarioGuardado));
    }
  }, []);

  useEffect(() => {
    if (user?.id_usuario) {
      fetchCantidadPedidos(user.id_usuario);
      fetchCantidadComentarios(user.id_usuario);
      fetchTodosLosPedidos(user.id_usuario);
    }
  }, [user]);

  useEffect(() => {
    if (mostrarPedidos || mostrarPasoPaso || mostrarDetallesPedido) {
      document.body.classList.add("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [mostrarPedidos, mostrarPasoPaso, mostrarDetallesPedido]);

  const fetchTodosLosPedidos = async (id_usuario) => {
    try {
      const response = await fetch(
        baseUrl + `pedido/todosLosPedidos/${id_usuario}`,
      );
      const data = await response.json();
      if (data) {
        setPedidos(data);
      } else {
        console.error("Datos de pedidos no son un arreglo:", data);
      }
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  };
  const fetchCantidadPedidos = async (id_usuario) => {
    try {
      const response = await fetch(baseUrl + `pedido/pedidos/${id_usuario}`);
      const data = await response.json();
      if (data && data[0] && data[0].total_pedidos !== undefined) {
        setCantidadPedidos(data[0].total_pedidos);
      }
    } catch (error) {
      console.error("Error al obtener la cantidad de pedidos:", error);
    }
  };

  const fetchCantidadComentarios = async (id_usuario) => {
    try {
      const response = await fetch(
        baseUrl + `usuario/comentarios/${id_usuario}`,
      );
      const data = await response.json();
      if (data && data[0] && data[0].total_comentarios !== undefined) {
        setCantidadComentarios(data[0].total_comentarios);
      }
    } catch (error) {
      console.error("Error al obtener la cantidad de pedidos:", error);
    }
  };

  const verPasoPaso = (id_pedido) => {
    setRecetaActual(pedidos.find((pedido) => pedido.id_pedido === id_pedido));
    setRecetaActual((prevReceta) => ({
      ...prevReceta,
      nivel: pedidos.find((pedido) => pedido.id_pedido === id_pedido)
        .receta_nivel,
      cantidad: pedidos.find((pedido) => pedido.id_pedido === id_pedido)
        .receta_cantidad,
    }));
  };

  return (
    <div className="min-h-screen bg-[#FFF1E7] text-rose-900">
      {/* Perfil principal */}
      <section className="mx-auto max-w-7xl px-4 py-8 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-3xl font-bold text-white">
          <img src={iconoUsuario} alt="Usuario" className="h-20 w-20" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">
          {user?.nombre_usuario || "Usuario"}
        </h1>
        <span className="inline-block rounded bg-yellow-500 px-3 py-1 text-sm text-white">
          Cliente Activo
        </span>
      </section>

      {/* Contenido */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-3">
        {/* Columna izquierda */}
        <div>
          {/* Información personal */}
          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">Información Personal</h2>
            <p className="text-sm">
              correo: {user?.email || "Usuario@example.com"}
            </p>
            <p className="text-sm">Teléfono: {user?.telefono || "123-456"}</p>
          </div>

          {/* Estadísticas */}
          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">Estadísticas</h2>
            <div className="flex justify-between">
              <span>Pedidos</span>
              <span className="rounded border border-yellow-400 px-2 py-1 text-sm">
                {cantidadPedidos}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Reseñas</span>
              <span className="rounded border border-yellow-400 px-2 py-1 text-sm">
                {cantidadComentarios}
              </span>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-6 lg:col-span-2">
          {/* Pedidos recientes */}
          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Pedidos Recientes</h2>
            <div className="space-y-2">
              {pedidos.length > 0 ? (
                pedidos.slice(0, 3).map((pedido) => (
                  <div
                    key={pedido.id_pedido}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-100 p-4"
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
                          verPasoPaso(pedido.id_pedido);
                        }}
                      >
                        Ver Receta
                      </button>
                      <button
                        className="cursor-pointer rounded border border-orange-500 bg-orange-500 px-3 py-1 text-sm text-white hover:bg-rose-900 hover:text-white"
                        onClick={() => setMostrarDetallesPedido(true)}
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
              <div className="mt-6 text-center">
                <button
                  className="cursor-pointer rounded border bg-orange-500 px-4 py-2 text-white hover:bg-rose-900"
                  onClick={() => setMostrarPedidos(true)}
                >
                  Ver Todos los Pedidos
                </button>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mb-10 grid gap-4 md:grid-cols-2">
            <Link to="/">
              <button className="w-full cursor-pointer rounded bg-orange-500 px-4 py-2 text-white hover:bg-rose-900">
                Explorar Recetas
              </button>
            </Link>
            <button
              className="w-full cursor-pointer rounded bg-orange-500 px-4 py-2 text-white hover:bg-rose-900"
              onClick={() => (window.location.href = "/EditarPerfil")}
            >
              Editar Perfil
            </button>
          </div>
        </div>
      </section>

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
                        verPasoPaso(pedido.id_pedido);
                      }}
                    >
                      Ver Receta
                    </button>
                    <button
                      className="cursor-pointer rounded border border-orange-500 bg-orange-500 px-3 py-1 text-sm text-white hover:bg-rose-900 hover:text-white"
                      onClick={() => setMostrarDetallesPedido(true)}
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

      {/* Paso a paso de la receta */}
      <section
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${mostrarPasoPaso ? "block" : "hidden"}`}
      >
        <div className="relative flex h-140 w-250 flex-col overflow-y-scroll rounded-lg bg-white p-6 text-red-900">
          <FaTimes
            className="absolute top-5 right-5 cursor-pointer text-gray-700"
            onClick={() => setMostrarPasoPaso(false)}
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
                      <ol className="list-inside list-decimal space-y-2 text-sm text-rose-900">
                        <li>
                          Remueve la tapa del envase y haz pequeños agujeros con
                          un tenedor
                        </li>
                        <li>
                          Calienta en potencia alta por{" "}
                          <strong>2-3 minutos</strong>
                        </li>
                        <li>
                          Revuelve bien y calienta 1 minuto más si es necesario
                        </li>
                        <li>Deja reposar 30 segundos antes de servir</li>
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
                        <li>
                          Si queda algo seco, agrega un poco de agua o caldo
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
                      onClick={() => setMostrarPasoPaso(false)}
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
                        ⏱️ 1 hora
                      </span>
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
                      <iframe
                        src={recetaActual ? recetaActual.video : ""}
                        title="YouTube video player"
                        className="aspect-video w-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
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
                      onClick={() => setMostrarPasoPaso(false)}
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
      <section
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${mostrarDetallesPedido ? "block" : "hidden"}`}
      >
        <div className="relative flex h-140 w-250 flex-col overflow-y-scroll rounded-lg bg-white p-6 text-red-900">
          <FaTimes
            className="absolute top-5 right-5 cursor-pointer text-gray-700"
            onClick={() => setMostrarDetallesPedido(false)}
          >
            x
          </FaTimes>
        </div>
      </section>
    </div>
  );
};

export default Perfil;
