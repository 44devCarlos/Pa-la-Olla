import { Router } from "express";
import { ControladorUsuario } from "../controllers/usuario.js";

export const crearUsuarioRouter = ({ usuarioModelo }) => {
	const router = Router();

	const usuarioControlador = new ControladorUsuario({ usuarioModelo });

	router.post("/agregarUsuarios", usuarioControlador.agregarUsuarios);
	//router.get("/", usuarioControlador.obtenerUsuarios());

	return router;
};
