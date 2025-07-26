import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { FaTimes, FaMinus, FaPlus } from "react-icons/fa";
import PaypalButton from "../components/PaypalButton";
import { Button } from "../components/button";
import MensajeDeAlerta from "./MensajeDeAlerta";

export default function OverlayOrdenarReceta({
  usuario,
  mostrarOverlay,
  setMostrarOverlay,
  receta,
  arrayPrecios,
  posicion,
  aumentar,
  disminuir,
  cantidad,
  setNivel,
  nivel,
  total,
  setTotal,
  handleAprobado,
  direccion,
  setDireccion,
}) {
  const [formularioCompleto, setFormularioCompleto] = useState(false);

  useEffect(() => {
    let verificar = false;

    document.querySelectorAll("input[type='radio']").forEach((input) => {
      if (input.checked) {
        verificar = true;
      }
    });
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    if (
      direccion.trim() !== "" &&
      verificar == true &&
      nombre.trim() !== "" &&
      telefono.trim() !== ""
    ) {
      setFormularioCompleto(true);
    } else {
      setFormularioCompleto(false);
    }
  }, [direccion, nivel, cantidad, total]);

  return (
    <section
      className={`fixed inset-0 z-30 flex items-center justify-center bg-black/70 ${mostrarOverlay ? "block" : "hidden"}`}
    >
      {!usuario ? (
        <MensajeDeAlerta
          contenido={
            <>
              <FaTimes
                className="absolute top-2 right-2 cursor-pointer text-gray-700"
                onClick={() => setMostrarOverlay(false)}
              >
                x
              </FaTimes>
              <p>Para continuar debes iniciar sesión.</p>
              <Link to="/login">
                <Button className="cursor-pointer rounded bg-red-900 p-2 text-white hover:bg-red-900/90">
                  Ir a Iniciar Sesión
                </Button>
              </Link>
            </>
          }
          estilo="bg-white relative text-red-900 p-4 rounded-lg shadow-lg flex justify-center items-center flex-col font-bold gap-4"
        />
      ) : null}
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
                <label className="peer flex h-16 w-full items-center space-x-3">
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
                      <span className="text-lg">💡</span>
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
                </label>
              </div>

              <div className="mb-4 flex h-16 w-full items-center space-x-3 px-2 text-red-900">
                <label className="peer flex h-16 w-full items-center space-x-3">
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
                  <div className="flex h-full w-full items-center justify-between rounded-lg border border-red-900/20 px-2">
                    <div className="flex w-full items-center space-x-3 px-3">
                      <span className="text-lg">🥘</span>
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
                </label>
              </div>

              <div className="mb-4 flex h-16 w-full items-center space-x-3 px-2 text-red-900">
                <label className="peer flex h-16 w-full items-center space-x-3">
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
                  <div className="flex h-full w-full items-center justify-between rounded-lg border border-red-900/20 px-2">
                    <div className="flex w-full items-center space-x-3 px-3">
                      <span className="text-lg">👨‍🍳</span>
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
                </label>
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
                id="nombre"
                type="text"
                className="rounded-md border border-red-900/20 p-2"
                disabled
                value={usuario.nombre_usuario}
                required
              />
            </div>
            <div className="mb-10 flex h-10 w-full flex-col">
              <label htmlFor="telefono" className="font-semibold">
                Teléfono:
              </label>
              <input
                id="telefono"
                type="tel"
                className="rounded-md border border-red-900/20 p-2"
                disabled
                value={usuario.telefono}
                required
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
  );
}
