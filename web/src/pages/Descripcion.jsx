import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

// Componentes importados
import { RecetaDetalles } from "../components/RecetaDetalles";
import { RecetasRelacionadas } from "../components/RecetasRelacionadas";
import SeccionComentarios from "../components/SeccionComentarios";
import OverlayOrdenarReceta from "../components/OverlayOrdenarReceta";

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
        receta_nivel: nivel,
        receta_cantidad: cantidad,
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
      <section className="mx-auto mb-20 max-w-screen-xl p-2 md:py-6">
        {/*Descripción de la receta*/}
        <RecetaDetalles
          receta={receta}
          calificaciones={calificaciones}
          setMostrarOverlay={setMostrarOverlay}
        />

        {/*Otras recetas*/}
        <RecetasRelacionadas
          todasLasRecetas={todasLasRecetas}
          handleVerReceta={handleVerReceta}
        />

        {/*Comentarios y Calificaciones*/}
        <SeccionComentarios
          calificaciones={calificaciones}
          comentarios={comentarios}
          receta={receta}
          usuario={usuario}
          setValor={setValor}
          handleSubmit={handleSubmit}
        />
      </section>

      {/* Overlay para ordenar receta */}
      <OverlayOrdenarReceta
        usuario={usuario}
        mostrarOverlay={mostrarOverlay}
        setMostrarOverlay={setMostrarOverlay}
        receta={receta}
        arrayPrecios={arrayPrecios}
        posicion={posicion}
        aumentar={aumentar}
        disminuir={disminuir}
        cantidad={cantidad}
        setNivel={setNivel}
        nivel={nivel}
        total={total}
        setTotal={setTotal}
        handleAprobado={handleAprobado}
        direccion={direccion}
        setDireccion={setDireccion}
      />
    </main>
  );
}
