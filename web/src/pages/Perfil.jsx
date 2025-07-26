import { Link } from "react-router-dom";
import iconoUsuario from "../assets/img/user.png";
import { useEffect, useState } from "react";

// Importe de los componentes
import ModalHistorialPedido from "../components/ModalHistorialPedido";
import ModalPasoPasoReceta from "../components/ModalPasoPasoReceta";
import ModalDetallesPedido from "../components/ModalDetallesPedido";

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
  const [mostrarVideo, setMostrarVideo] = useState(false);

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
    if (
      mostrarPedidos ||
      mostrarPasoPaso ||
      mostrarDetallesPedido ||
      mostrarVideo
    ) {
      document.body.classList.add("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [mostrarPedidos, mostrarPasoPaso, mostrarDetallesPedido, mostrarVideo]);

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

  const verDetalles = (id_pedido) => {
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
        <span className="inline-block rounded bg-red-600 px-3 py-1 text-sm text-white">
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
              <span className="rounded border border-red-600 px-2 py-1 text-sm">
                {cantidadPedidos}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Reseñas</span>
              <span className="rounded border border-red-600 px-2 py-1 text-sm">
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
                        className="cursor-pointer rounded border border-red-500 bg-red-600 px-3 py-1 text-sm text-white hover:bg-rose-900 hover:text-white"
                        onClick={() => {
                          setMostrarPasoPaso(true);
                          setMostrarVideo(true);
                          verDetalles(pedido.id_pedido);
                        }}
                      >
                        Ver Receta
                      </button>
                      <button
                        className="cursor-pointer rounded border border-red-500 bg-red-600 px-3 py-1 text-sm text-white hover:bg-rose-900 hover:text-white"
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
              <div className="mt-6 text-center">
                <button
                  className="cursor-pointer rounded border bg-red-600 px-4 py-2 text-white hover:bg-rose-900"
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
              <button className="w-full cursor-pointer rounded bg-red-600 px-4 py-2 text-white hover:bg-rose-900">
                Explorar Recetas
              </button>
            </Link>
            <button
              className="w-full cursor-pointer rounded bg-red-600 px-4 py-2 text-white hover:bg-rose-900"
              onClick={() => (window.location.href = "/EditarPerfil")}
            >
              Editar Perfil
            </button>
          </div>
        </div>
      </section>

      {/* Historial de pedido */}
      <ModalHistorialPedido
        mostrarPedidos={mostrarPedidos}
        setMostrarPedidos={setMostrarPedidos}
        pedidos={pedidos}
        verDetalles={verDetalles}
        setMostrarPasoPaso={setMostrarPasoPaso}
        setMostrarVideo={setMostrarVideo}
        setMostrarDetallesPedido={setMostrarDetallesPedido}
      />

      {/* Paso a paso de la receta */}
      <ModalPasoPasoReceta
        mostrarPasoPaso={mostrarPasoPaso}
        setMostrarPasoPaso={setMostrarPasoPaso}
        setMostrarVideo={setMostrarVideo}
        mostrarVideo={mostrarVideo}
        recetaActual={recetaActual}
      />

      {/* Detalles del pedido */}
      <ModalDetallesPedido
        mostrarDetallesPedido={mostrarDetallesPedido}
        setMostrarDetallesPedido={setMostrarDetallesPedido}
        recetaActual={recetaActual}
        user={user}
      />

    </div>
  );
};

export default Perfil;
