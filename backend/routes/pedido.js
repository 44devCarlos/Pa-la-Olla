import {Router} from "express";
import { ControladorPedido } from "../controllers/pedido.js";

export const crearPedidoRouter = ({ pedidoModelo }) => {
	const router = Router();

	const controladorPedido = new ControladorPedido({ pedidoModelo });

	router.post("/registrarPedido", controladorPedido.registrarPedido);
	router.get("/pedidos/:id_usuario", controladorPedido.obtenerCantidadPedidos);
	router.get("/todosLosPedidos/:id_usuario", controladorPedido.obtenerTodosLosPedidos);

	return router;
};