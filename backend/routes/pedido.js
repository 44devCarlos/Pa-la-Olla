import {Router} from "express";
import { ControladorPedido } from "../controllers/pedido.js";

export const crearPedidoRouter = ({ pedidoModelo }) => {
	const router = Router();

	const controladorPedido = new ControladorPedido({ pedidoModelo });

	router.post("/registrarPedido", controladorPedido.registrarPedido);

	return router;
};