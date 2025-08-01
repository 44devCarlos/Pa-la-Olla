import { connection } from "./configDB.js";
// File: backend/models/receta.js

export class ModeloReceta {
	static async ObtenerRecetasPopulares() {
		const [recetas] = await connection.query(
			`Call obtener_recetas_populares()`
		);
		return recetas[0];
	}

	static async ObtenerIngredientesPrincipales() {
		const [ingredientes] = await connection.query(
			`Call obtener_ingredientes_principales()`
		);
		return ingredientes[0];
	}

	static async ObtenerTodasLasRecetas() {
		const [recetas] = await connection.query(
			`Call obtener_todas_las_recetas()`
		);
		return recetas[0];
	}

	static async FiltrarPorIngrediente(ingrediente) {
		const [recetas] = await connection.query(
			`Call obtener_receta_por_filtro(?)`,
			[ingrediente]
		);
		return recetas[0];
	}

	static async ObtenerCalificacionesPorReceta(id_receta) {
		const [calificaciones] = await connection.query(
			`Call obtener_calificaciones_receta(?)`,
			[id_receta]
		);
		return calificaciones[0];
	}

	static async ObtenerComentariosReceta(id_receta) {
		const [comentarios] = await connection.query(
			`Call obtener_comentarios_receta(?)`,
			[id_receta]
		);
		return comentarios[0];
	}

	static async AgregarComentario(
		id_usuario,
		id_receta,
		descripcion,
		calificacion
	) {
		const [resultado] = await connection.query(
			`Call agregar_comentario(?, ?, ?, ?)`,
			[id_usuario, id_receta, descripcion, calificacion]
		);
		return resultado[0][0]?.resultado;
	}

	static async ObtenerPrecioPorNiveles(id_receta) {
		const [precios] = await connection.query(
			`Call obtener_precio_por_niveles(?)`,
			[id_receta]
		);
		return precios[0];
	}

	static async VerReceta(id_receta) {
		const [receta] = await connection.query(`Call ver_receta(?)`, [
			id_receta,
		]);
		return receta[0];
	}
}
