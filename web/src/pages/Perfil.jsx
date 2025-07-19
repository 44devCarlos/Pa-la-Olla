import { Link } from "react-router-dom";
import iconoUsuario from "../assets/img/user.png";
import { useEffect, useState } from "react";
const Perfil = () => {
  const baseUrl = "http://localhost:3305/";
  const [user, setUser] = useState(null);
  const [cantidadPedidos, setCantidadPedidos] = useState(0);
  const [cantidadComentarios, setCantidadComentarios] = useState(0);
  
  
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
  }
}, [user]);
  const fetchCantidadPedidos = async (id_usuario) => {
  try {
    const response = await fetch(baseUrl+`pedido/pedidos/${id_usuario}`);
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
    const response = await fetch(baseUrl+`usuario/comentarios/${id_usuario}`);
    const data = await response.json();
    if (data && data[0] && data[0].total_comentarios !== undefined) {
      setCantidadComentarios(data[0].total_comentarios);
    }
  } catch (error) {
    console.error("Error al obtener la cantidad de pedidos:", error);
  }
};
  return (
    <div className="min-h-screen bg-[#FFF1E7] text-rose-900">
     
      {/* Perfil principal */}
      <section className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
           <img
              src={iconoUsuario}
              alt="Usuario"
              className="w-20 h-20 "
            />
        </div>
        <h1 className="text-3xl font-bold mb-2">{user?.nombre_usuario || "Usuario"}</h1>
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
            <p className="text-sm">correo: {user?.email || "Usuario@example.com"}</p>
            <p className="text-sm">Teléfono: {user?.telefono || "123-456"}</p>
          </div>

          {/* Estadísticas */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow space-y-4">
            <h2 className="text-lg font-semibold">Estadísticas</h2>
            <div className="flex justify-between">
              <span>Pedidos</span>
              <span className="border border-yellow-400 px-2 py-1 rounded text-sm">{cantidadPedidos}</span>
            </div>
            <div className="flex justify-between">
              <span>Reseñas</span>
              <span className="border border-yellow-400 px-2 py-1 rounded text-sm">{cantidadComentarios}</span>
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
                   <button className="border cursor-pointer bg-orange-500 text-white border-orange-500 px-3 py-1 rounded text-sm  hover:bg-rose-900 hover:text-white">
                    Ver Receta
                  </button>
                  <button className="border cursor-pointer bg-orange-500 text-white border-orange-500 px-3 py-1 rounded text-sm  hover:bg-rose-900 hover:text-white">
                    Ver Detalles
                  </button>
                </div>
              </div>
              {/* Puedes duplicar este bloque para más pedidos */}
            </div>
            <div className="text-center mt-6">
              <button className="border cursor-pointer  bg-orange-500 text-white px-4 py-2 rounded hover:bg-rose-900">
                Ver Todos los Pedidos
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/">
              <button className="w-full cursor-pointer bg-orange-500 text-white px-4 py-2 rounded hover:bg-rose-900">
                Explorar Recetas
              </button>
            </Link>
            <button className="w-full cursor-pointer bg-orange-500 text-white px-4 py-2 rounded hover:bg-rose-900" onClick={() => (window.location.href = "/EditarPerfil")}>
                Editar Perfil
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Perfil;
