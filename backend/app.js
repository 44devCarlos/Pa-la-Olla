import cors from "cors";
import express from "express";
import { PORT } from "./config.js";
import { crearRecetaRouter } from './routes/receta.js'
import { crearUsuarioRouter } from './routes/usuario.js'

export const createApp = ({modelos}) => {
	const app = express();
	app.use(cors());
	app.use(express.json());
	app.use("/receta", crearRecetaRouter({ recetaModelo: modelos.ModeloReceta }));
	app.use("/usuario", crearUsuarioRouter({usuarioModelo: modelos.ModeloUsuario}));
	

	app.use((req, res) => {
		res.status(404).json({ error: "Recurso no encontrado" });
	});

	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
	return app;
};
