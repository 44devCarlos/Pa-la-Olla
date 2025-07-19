import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/Card";
import { Button } from "../components/button";
import RatingBar from "../components/RatingBar";
import StarRating from "../components/StarRating";
import PaypalButton from "../components/PaypalButton";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FaStar, FaTimes, FaPlus, FaMinus } from "react-icons/fa";

export default function Descripcion() {
  const baseUrl = "http://localhost:3305/";
  const usuario = JSON.parse(localStorage.getItem("usuario")) || false;
  const location = useLocation();
  const navigate = useNavigate();
  const nombre_receta = useParams().nombreReceta;
  const { receta } = location.state || {};
  const [todasLasRecetas, setTodasLasRecetas] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [comentarioAgregado, setComentarioAgregado] = useState(false);
  const [calificaciones, setCalificaciones] = useState([]);
  const [precio, setPrecio] = useState({});
  const [valor, setValor] = useState([]);
  const [mostrarOverlay, setMostrarOverlay] = useState(false);
  const [posicion, setPosicion] = useState(0);
  const [cantidad, setCantidad] = useState(2);
  const [total, setTotal] = useState(0);
  const [nivel, setNivel] = useState(null);
  const [direccion, setDireccion] = useState("");
  const [formularioCompleto, setFormularioCompleto] = useState(false);

  const aumentar = () => {
    setCantidad((prev) => (prev < 6 ? prev + 2 : 6));
    setPosicion((prev) => (prev < 2 ? prev + 1 : 2));
  };
  const disminuir = () => {
    setCantidad((prev) => (prev > 2 ? prev - 2 : 2));
    setPosicion((prev) => (prev > 0 ? prev - 1 : 0));
  };

  useEffect(() => {
    if (!nivel) return;

    if (nivel === "principiante") {
      setTotal(Number(arrayPrecios[posicion][0].precio).toFixed(2));
    } else if (nivel === "intermedio") {
      setTotal(Number(arrayPrecios[posicion][1].precio).toFixed(2));
    } else if (nivel === "avanzado") {
      setTotal(Number(arrayPrecios[posicion][2].precio).toFixed(2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cantidad, posicion, nivel]);

  useEffect(() => {
    fetch(baseUrl + `receta/calificaciones/${receta.id_receta}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data) {
          console.error("Receta no encontrada");
          return;
        }
        setCalificaciones(data[0]);
      })
      .catch((err) => console.error("Error al obtener la receta:", err));

    fetch(baseUrl + `receta/precio/${receta.id_receta}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data) {
          console.error("Receta no encontrada");
          return;
        }
        setPrecio(data[0]);
      })
      .catch((err) => console.error("Error al obtener el precio:", err));
  }, [receta.id_receta, comentarioAgregado]);

  useEffect(() => {
    fetch(baseUrl + "receta/todas")
      .then((res) => res.json())
      .then((data) => {
        setTodasLasRecetas(barajear(data));
      })
      .catch((err) =>
        console.error("Error al obtener todas las recetas:", err),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receta.id_receta]);

  useEffect(() => {
    fetch(baseUrl + `receta/comentarios/${receta.id_receta}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data) {
          console.error("Receta no encontrada");
          return;
        }
        setComentarios(data);
      })
      .catch((err) => console.error("Error al obtener la receta:", err));
  }, [receta.id_receta, comentarioAgregado]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [nombre_receta]);

  useEffect(() => {
    if (mostrarOverlay) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [mostrarOverlay]);

  useEffect(() => {
    let verificar = false;
    document.querySelectorAll("input[type='radio']").forEach((input) => {
      if (input.checked) {
        verificar = true;
      }
    });
    if (direccion.trim() !== "" && verificar == true) {
      setFormularioCompleto(true);
    } else {
      setFormularioCompleto(false);
    }
  }, [direccion, nivel, cantidad, total]);

  function barajear(recetas) {
    for (let i = recetas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [recetas[i], recetas[j]] = [recetas[j], recetas[i]];
    }

    const index = recetas.findIndex(
      (r) => r.nombre_receta === receta.nombre_receta,
    );
    if (index !== -1) {
      recetas.splice(index, 1);
    }
    return recetas;
  }

  const handleVerReceta = (receta) => {
    navigate(`/descripcion/${receta.nombre_receta}`, { state: { receta } });
  };

  const handleSubmit = () => {
    if (!usuario) {
      alert("Debes iniciar sesión para dejar un comentario.");
      return;
    }
    const comentarioInput = document.getElementById("cajaComentario");
    const calificacionInput = valor;
    if (!comentarioInput || !calificacionInput) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    const comentario = comentarioInput.value;
    const calificacion = calificacionInput;

    const id_usuario = usuario.id_usuario;
    const id_receta = receta.id_receta;
    fetch(baseUrl + "receta/agregarComentario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_usuario,
        id_receta,
        descripcion: comentario,
        calificacion,
      }),
    })
      .then((res) => res)
      .then((data) => {
        if (data.error) {
          alert(data.error);
          return;
        }
        alert("Comentario agregado exitosamente.");
        comentarioInput.value = "";
        setComentarioAgregado(true);
        setComentarios((prev) => [...prev, data]);
      })
      .catch((err) => console.error("Error al agregar comentario:", err));
  };

  const handleAprobado = (details) => {
    const id_usuario = usuario.id_usuario;
    const id_receta = receta.id_receta;
    fetch(baseUrl + "pedido/registrarPedido", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_usuario,
        id_receta,
        orden_paypal: details.id,
        precio: details.purchase_units[0].amount.value,
        direccion:
          document.getElementById("direccion").value || "No especificada",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
          return;
        }
        alert("Orden realizada exitosamente. Mira la receta en tu perfil.");
        setDireccion("");
        document.querySelectorAll("input[type='radio']").forEach((input) => {
          input.checked = false;
        });
        setCantidad(2);
        setPosicion(0);
        setNivel(null);
        setTotal(0);
      })
      .catch((err) => console.error("Error al realizar la orden:", err));
  };

  const arrayPrecios = [
    [
      {
        nivel: "Principiante",
        precio: precio.principiante_2 || 0,
      },
      {
        nivel: "Intermedio",
        precio: precio.intermedio_2 || 0,
      },
      {
        nivel: "Avanzado",
        precio: precio.avanzado_2 || 0,
      },
    ],
    [
      {
        nivel: "Principiante",
        precio: precio.principiante_4 || 0,
      },
      {
        nivel: "Intermedio",
        precio: precio.intermedio_4 || 0,
      },
      {
        nivel: "Avanzado",
        precio: precio.avanzado_4 || 0,
      },
    ],
    [
      {
        nivel: "Principiante",
        precio: precio.principiante_6 || 0,
      },
      {
        nivel: "Intermedio",
        precio: precio.intermedio_6 || 0,
      },
      {
        nivel: "Avanzado",
        precio: precio.avanzado_6 || 0,
      },
    ],
  ];

  return (
    <main>
      <section className="mx-auto max-w-screen-xl p-2 md:py-6">
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex h-[31rem] flex-col items-center justify-center">
            <img
              src={receta.imagen_receta}
              alt={receta.nombre_receta}
              className="aspect-video rounded-t-xl shadow-2xl"
            />
          </div>

          <div className="flex flex-col items-start justify-center">
            <h1 className="mb-6 text-5xl font-bold text-red-900">
              {receta.nombre_receta}
            </h1>
            <p className="mb-4 leading-8 text-red-800">
              {receta.descripcion_receta}
            </p>

            <div className="flex w-full flex-col items-center justify-center gap-y-4">
              <Button
                className={"flex self-baseline font-semibold text-red-900"}
              >
                📋 Información de Alérgenos
              </Button>
              <span className="self-start rounded-full border bg-red-500/20 px-2 text-sm font-semibold text-red-900">
                {receta.alergenos_receta}
              </span>
              <Button
                className={
                  "mt-4 h-10 w-full cursor-pointer rounded-md bg-[#F21B4E] font-semibold text-white hover:bg-red-800"
                }
                onClick={() => setMostrarOverlay(true)}
              >
                🛒 Ordenar Ahora
              </Button>
            </div>
            <div className="mt-5 flex h-26 w-[85%] items-center justify-center gap-x-1 self-center rounded-xl bg-white pb-4 text-sm text-orange-700 sm:gap-x-14 md:mb-2 md:w-[90%] md:gap-x-6 lg:gap-x-14">
              <div className="flex flex-col items-center">
                <span>📋</span>
                <span>Tiempo</span>
                <span className="font-bold text-red-800">
                  {receta.rango_tiempo}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span>📋</span>
                <span>Porciones</span>
                <span className="font-bold text-red-800">
                  {receta.rango_porciones}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span>📋</span>
                <span>Rating</span>
                <span className="font-bold text-red-800">
                  {parseFloat(calificaciones.calificacion_promedio).toFixed(
                    1,
                  ) !== "NaN"
                    ? parseFloat(calificaciones.calificacion_promedio).toFixed(
                        1,
                      )
                    : 0}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span>📋</span>
                <span>Precio</span>
                <span className="font-bold text-red-800">
                  {receta.rango_precio}
                </span>
              </div>
            </div>
          </div>
        </section>

        <h2 className="mt-10 mb-4 text-2xl font-bold text-red-900">
          Otras Recetas que te Podrían Gustar
        </h2>
        <section className="flex snap-x snap-mandatory items-center gap-x-4 overflow-x-scroll scroll-smooth transition-transform duration-300">
          {todasLasRecetas.slice(0, 4).map((r, i) => (
            <Card
              key={i}
              className="group w-[100%] flex-shrink-0 snap-center rounded-md p-4 transition-shadow duration-100 hover:shadow-xl/10 md:w-[35%]"
            >
              <div className="overflow-hidden">
                <img
                  src={r.imagen_receta}
                  alt={r.nombre_receta}
                  className="h-56 w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="py-4 text-red-900">
                <h3 className="mb-1 text-lg font-bold text-red-900 group-hover:text-orange-700">
                  {r.nombre_receta}
                </h3>
                <p className="line-clamp-2 text-sm">{r.descripcion_receta}</p>
                <div className="mt-2 flex flex-row justify-between">
                  <p className="text-sm">⏱️ {r.rango_tiempo}</p>
                  <p className="text-sm">⏱️ {r.rango_porciones}</p>
                  <p className="mb-2 text-sm text-orange-700">
                    💵 {r.rango_precio}
                  </p>
                </div>
                <Button
                  className={
                    "w-full cursor-pointer rounded-md border py-1 text-orange-700 hover:bg-orange-700 hover:font-semibold hover:text-white"
                  }
                  onClick={() => handleVerReceta(r)}
                >
                  Ver Receta
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-12 flex flex-col items-center justify-center gap-y-6 text-red-900">
          <div className="flex w-[70%] flex-col items-center justify-center gap-x-4">
            <h2 className="mb-4 self-start text-2xl font-semibold">
              Comentarios y Calificaciones
            </h2>
            <div className="flex w-full items-center justify-center gap-x-4 px-2 pb-10 shadow-lg">
              <div className="rounded-xl p-4 text-center shadow">
                <p className="text-3xl font-bold text-orange-600">
                  {parseFloat(calificaciones.calificacion_promedio).toFixed(
                    1,
                  ) !== "NaN"
                    ? parseFloat(calificaciones.calificacion_promedio).toFixed(
                        1,
                      )
                    : 0}
                </p>
                <StarRating
                  value={calificaciones.calificacion_promedio}
                  readOnly
                />
                <p className="text-sm">
                  {calificaciones.total_comentario} reseñas
                </p>
              </div>
              <div className="flex flex-col items-start justify-center gap-y-1">
                <RatingBar
                  stars={5}
                  count={calificaciones.cinco_estrellas}
                  maxCount={calificaciones.total_comentario}
                />
                <RatingBar
                  stars={4}
                  count={calificaciones.cuatro_estrellas}
                  maxCount={calificaciones.total_comentario}
                />
                <RatingBar
                  stars={3}
                  count={calificaciones.tres_estrellas}
                  maxCount={calificaciones.total_comentario}
                />
                <RatingBar
                  stars={2}
                  count={calificaciones.dos_estrellas}
                  maxCount={calificaciones.total_comentario}
                />
                <RatingBar
                  stars={1}
                  count={calificaciones.una_estrella}
                  maxCount={calificaciones.total_comentario}
                />
              </div>
            </div>
          </div>

          <div className="mb-6 w-[70%] rounded-xl bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-xl font-medium">Deja tu Comentario</h3>
            {usuario ? (
              <div className="flex flex-col gap-x-2">
                <textarea
                  id="cajaComentario"
                  className="mb-2 w-full rounded border p-2"
                  placeholder={`Cuéntanos qué te pareció ${receta.nombre_receta}...`}
                />
                <label className="font-semibold">Calificación:</label>
                <StarRating onChange={(value) => setValor(value)} />
                <Button
                  className={
                    "w-full cursor-pointer rounded-full bg-red-900 py-2 font-semibold text-white"
                  }
                  onClick={handleSubmit}
                >
                  Enviar Comentario
                </Button>
              </div>
            ) : (
              <p className="text-sm text-red-600">
                Debes iniciar sesión para dejar un comentario.
              </p>
            )}
          </div>

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
                      <p className="font-semibold">
                        {comentario.nombre_usuario}
                      </p>
                      <span className="text-sm">
                        <StarRating
                          value={comentario.calificacion}
                          readOnly
                          tamaño={18}
                        />
                      </span>
                      <div className="w-20 text-left sm:w-auto">
                        <span className="ml-2 text-sm break-words whitespace-normal">
                          {new Date(
                            comentario.fecha_comentario,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="ml-10 inline-block rotate-90 rounded-full border border-yellow-500 px-2 py-3 text-sm transition-all duration-300 sm:ml-0 sm:-rotate-0 sm:py-0">
                    <span className="inline-block w-10 -rotate-90 transition-all duration-300 sm:rotate-0 sm:py-1">
                      {parseFloat(comentario.calificacion).toFixed(1)}
                      <FaStar
                        className="inline-block text-yellow-500"
                        size={18}
                      />
                    </span>
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {comentario.descripcion}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
      <section
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 ${mostrarOverlay ? "block" : "hidden"}`}
      >
        <div className="relative flex h-140 w-125 flex-col overflow-y-scroll rounded-lg bg-white p-6 text-red-900">
          <div className="mb-4">
            <h1 className="font-bold">Ordenar {receta.nombre_receta}</h1>
            <p>Completa tus datos para realizar el pedido</p>
            <FaTimes
              className="absolute top-2 right-2 cursor-pointer text-gray-700"
              onClick={() => setMostrarOverlay(false)}
            >
              x
            </FaTimes>
          </div>

          <div className="rounded-md border border-red-900/20 p-4 font-bold">
            <div className="mb-6 flex items-center justify-between">
              <h1>{receta.nombre_receta}</h1>
            </div>
            <div className="flex flex-col justify-between gap-y-2 font-normal">
              <div className="flex items-center justify-between font-bold">
                <p>Cantidad:</p>
                <div className="flex items-center gap-x-2">
                  <Button
                    className={
                      "group flex size-10 cursor-pointer items-center justify-center rounded-lg border border-orange-600/60 hover:bg-orange-600"
                    }
                    onClick={disminuir}
                  >
                    <FaMinus
                      size={10}
                      className="text-red-900 group-hover:text-white"
                    />
                  </Button>
                  <p>{cantidad}</p>
                  <Button
                    className={
                      "group flex size-10 cursor-pointer items-center justify-center rounded-lg border border-orange-600 hover:bg-orange-600"
                    }
                    onClick={aumentar}
                  >
                    <FaPlus
                      size={10}
                      className="text-red-900 group-hover:text-white"
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <form>
            <div className="my-6">
              <h1 className="mb-6 font-bold">
                Nivel de Complejidad de Preparación
              </h1>
              <div className="flex w-full flex-col items-center justify-center px-2">
                <div className="mb-4 flex h-16 w-full items-center space-x-3 px-2 text-red-900">
                  <input
                    className="group size-4 cursor-pointer accent-red-900"
                    type="radio"
                    name="complejidad"
                    value="principiante"
                    required
                    onClick={() => {
                      setNivel("principiante");
                      setTotal(
                        Number(arrayPrecios[posicion][0].precio).toFixed(2),
                      );
                    }}
                  />
                  <div className="flex h-full w-full items-center justify-between rounded-lg border border-red-900/20 px-2">
                    <div className="flex w-full items-center space-x-3 px-3">
                      <img src={receta.imagen} alt="" className="size-5" />
                      <div className="flex flex-col">
                        <p className="font-bold">Principiante</p>
                        <p className="text-sm font-semibold">
                          Preparación sencilla
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <p className="font-semibold text-orange-600">
                        ${Number(arrayPrecios[posicion][0].precio).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 flex h-16 w-full items-center space-x-3 px-2 text-red-900">
                  <div>
                    <input
                      className="size-4 cursor-pointer accent-red-900"
                      type="radio"
                      name="complejidad"
                      value="intermedio"
                      required
                      onClick={() => {
                        setNivel("intermedio");
                        setTotal(
                          Number(arrayPrecios[posicion][1].precio).toFixed(2),
                        );
                      }}
                    />
                  </div>
                  <div className="flex h-full w-full items-center justify-between rounded-lg border border-red-900/20 px-2">
                    <div className="flex w-full items-center space-x-3 px-3">
                      <img src={receta.imagen} alt="" className="size-5" />
                      <div className="flex flex-col">
                        <p className="font-bold">Intermedio</p>
                        <p className="text-sm font-semibold">
                          Preparación moderada
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <p className="font-semibold text-orange-600">
                        ${Number(arrayPrecios[posicion][1].precio).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 flex h-16 w-full items-center space-x-3 px-2 text-red-900">
                  <div>
                    <input
                      className="size-4 cursor-pointer accent-red-900"
                      type="radio"
                      name="complejidad"
                      value="avanzado"
                      required
                      onClick={() => {
                        setNivel("avanzado");
                        setTotal(
                          Number(arrayPrecios[posicion][2].precio).toFixed(2),
                        );
                      }}
                    />
                  </div>
                  <div className="flex h-full w-full items-center justify-between rounded-lg border border-red-900/20 px-2">
                    <div className="flex w-full items-center space-x-3 px-3">
                      <img src={receta.imagen} alt="" className="size-5" />
                      <div className="flex flex-col">
                        <p className="font-bold">Avanzado</p>
                        <p className="text-sm font-semibold">
                          Preparación avanzada
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <p className="font-semibold text-orange-600">
                        ${Number(arrayPrecios[posicion][2].precio).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 flex h-16 w-full items-center justify-between space-x-3 rounded-lg border border-red-900/20 px-2 text-red-900">
                  <p className="font-semibold">Total de pedido:</p>
                  <p
                    id="total-pedido"
                    className="text-xl font-bold text-orange-600"
                  >
                    ${total || "0.00"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 flex w-full flex-col items-center justify-between">
              <h1 className="mb-6 w-full border-b border-red-900/20 pb-2 text-left font-bold">
                Información de Contacto
              </h1>
              <div className="mb-10 flex h-10 w-full flex-col">
                <label htmlFor="nombre" className="font-semibold">
                  Nombre completo:
                </label>
                <input
                  type="text"
                  className="rounded-md border border-red-900/20 p-2"
                  disabled
                  value={usuario.nombre_usuario}
                />
              </div>
              <div className="mb-10 flex h-10 w-full flex-col">
                <label htmlFor="telefono" className="font-semibold">
                  Teléfono:
                </label>
                <input
                  type="tel"
                  className="rounded-md border border-red-900/20 p-2"
                  disabled
                  value={usuario.telefono}
                />
              </div>
              <div className="flex h-10 w-full flex-col">
                <label htmlFor="direccion" className="font-semibold">
                  Dirección:
                </label>
                <input
                  id="direccion"
                  type="text"
                  className="rounded-md border border-red-900/20 p-2"
                  placeholder="Tu dirección"
                  required
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>
            </div>

            {formularioCompleto && (
              <div className="bottom-6 mt-10 flex w-full flex-col transition-all duration-300">
                <PaypalButton
                  monto={total}
                  descripcion={`Pedido de ${receta.nombre_receta} para ${cantidad} personas`}
                  onSuccess={(details) => {
                    handleAprobado(details);
                    setMostrarOverlay(false);
                  }}
                />
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
