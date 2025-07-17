import { Router } from "express";
import { ControladorUsuario } from "../controllers/usuario.js";

export const crearUsuarioRouter = ({ usuarioModelo }) => {
	const router = Router();

	const usuarioControlador = new ControladorUsuario({ usuarioModelo });

	router.post("/agregarUsuarios", usuarioControlador.agregarUsuarios);
	router.post("/consultarUsuarios", usuarioControlador.consultarUsuarios);
	router.post("/actualizarUsuarios", usuarioControlador.actualizarUsuarios);
	//router.get("/", usuarioControlador.obtenerUsuarios());

	return router;
};
