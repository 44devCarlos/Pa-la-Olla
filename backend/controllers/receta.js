export class ControladorReceta {
	constructor({ recetaModelo }) {
		this.recetaModelo = recetaModelo;
	}
	obtenerRecetasPopulares = async (req, res) => {
		const recetas = await this.recetaModelo.ObtenerRecetasPopulares();
		return res.json(recetas);
	};

	obtenerIngredientesPrincipales = async (req, res) => {
		const recetas =
			await this.recetaModelo.ObtenerIngredientesPrincipales();
		return res.json(recetas);
	};

	obtenerTodasLasRecetas = async (req, res) => {
		const recetas = await this.recetaModelo.ObtenerTodasLasRecetas();
		return res.json(recetas);
	};

	filtrarPorIngrediente = async (req, res) => {
		const { ingrediente } = req.query;

		if (!ingrediente) {
			return res.status(400).json({ error: "Ingrediente requerido" });
		}

		const recetas = await this.recetaModelo.FiltrarPorIngrediente(
			ingrediente
		);
		return res.json(recetas);
	};

	obtenerCalificacionesPorReceta = async (req, res) => {
		const { id_receta } = req.params;

		if (!id_receta) {
			return res.status(400).json({ error: "ID de receta requerido" });
		}

		const calificaciones =
			await this.recetaModelo.ObtenerCalificacionesPorReceta(id_receta);
		return res.json(calificaciones);
	};

	obtenerComentariosReceta = async (req, res) => {
		const { id_receta } = req.params;

		if (!id_receta) {
			return res.status(400).json({ error: "ID de receta requerido" });
		}

		const comentarios = await this.recetaModelo.ObtenerComentariosReceta(
			id_receta
		);
		return res.json(comentarios);
	};

	agregarComentario = async (req, res) => {
		const { id_usuario, id_receta, descripcion, calificacion } = req.body;

		if (!id_usuario || !id_receta || !descripcion || !calificacion) {
			return res
				.status(400)
				.json({ error: "Todos los campos son requeridos" });
		}

		const resultado = await this.recetaModelo.AgregarComentario(
			id_usuario,
			id_receta,
			descripcion,
			calificacion
		);
		
		if (resultado === "existe") {
			return res
				.status(400)
				.json({ error: "Ya has comentado esta receta" });
		}

		res.status(200).json({ mensaje: "Comentario agregado exitosamente" });
	};

	obtenerPrecioPorNiveles = async (req, res) => {
		const { id_receta } = req.params;

		if (!id_receta) {
			return res.status(400).json({ error: "ID de receta requerido" });
		}

		const precios = await this.recetaModelo.ObtenerPrecioPorNiveles(
			id_receta
		);
		return res.json(precios);
	};

	verReceta = async (req, res) => {
		const { id_receta } = req.params;

		if (!id_receta) {
			return res.status(400).json({ error: "ID de receta requerido" });
		}

		const receta = await this.recetaModelo.VerReceta(id_receta);
		return res.json(receta);
	};
}
