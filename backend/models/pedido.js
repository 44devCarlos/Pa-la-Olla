import { connection } from "./configDB.js";

export class ModeloPedido {
	static async registrarPedido(id_usuario, id_receta, precio, direccion) {
		const [resultado] = await connection.query(
			`Call registrar_pedido(?, ?, ?, ?)`,
			[id_usuario, id_receta, precio, direccion]
		);
		return resultado[0];
	}
}
