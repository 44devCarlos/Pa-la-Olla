import { createApp } from "./app.js";
// File: backend/app.js
import { ModeloUsuario } from "./models/usuario.js";
import { ModeloReceta } from "./models/receta.js";
import { ModeloPedido } from "./models/pedido.js";

const modelos = {
	ModeloUsuario,
	ModeloReceta,
	ModeloPedido,
};


createApp({ modelos });
