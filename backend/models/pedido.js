import { connection } from "./configDB.js";

export class ModeloPedido {
	static async registrarPedido(id_usuario, id_receta, orden_paypal, precio, receta_nivel, receta_cantidad, direccion) {
		const [resultado] = await connection.query(
			`Call registrar_pedido(?, ?, ?, ?, ?, ?, ?)`,
			[id_usuario, id_receta, orden_paypal, precio, receta_nivel, receta_cantidad, direccion]
		);
		return resultado[0];
	}

	static async obtenerCantidadPedidos(id_usuario) {
		const [resultado] = await connection.query(
			`Call obtener_total_pedidos_usuario(?)`,
			[id_usuario]
		);
		return resultado[0];
	}

	static async obtenerTodosLosPedidos(id_usuario) {
		const [resultado] = await connection.query(
			`Call obtener_todos_los_pedidos_por_usuario(?)`,
			[id_usuario]
		);
		return resultado[0];
	}
}
