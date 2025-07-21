export class ControladorPedido{
    constructor({ pedidoModelo }) {
        this.pedidoModelo = pedidoModelo;
    }
    
    registrarPedido = async (req, res) => {
        const { id_usuario, id_receta, orden_paypal, precio, receta_nivel, receta_cantidad, direccion } = req.body;

        if (!id_usuario || !id_receta || !orden_paypal || !precio || !receta_nivel || !receta_cantidad || !direccion) {
            return res.status(400).json({ error: "Todos los campos son requeridos" });
        }

        try {
            const resultado = await this.pedidoModelo.registrarPedido(
                id_usuario,
                id_receta,
                orden_paypal,
                precio,
                receta_nivel,
                receta_cantidad,
                direccion
            );
            return res.status(201).json({
                mensaje: "Pedido registrado exitosamente",
                data: resultado,
            });
        } catch (error) {
            return res.status(500).json({
                error: "Error al registrar el pedido",
                detalles: error.message,
            });
        }
    }

    obtenerCantidadPedidos = async (req, res) => {
		const { id_usuario } = req.params;

		if (!id_usuario) {
			return res.status(400).json({ error: "ID de usuario requerido" });
		}

		const pedidos = await this.pedidoModelo.obtenerCantidadPedidos(
			id_usuario
		);
		return res.json(pedidos);
	};

    obtenerTodosLosPedidos = async (req, res) => {
        const { id_usuario } = req.params;

        if (!id_usuario) {
            return res.status(400).json({ error: "ID de usuario requerido" });
        }

        try {
            const pedidos = await this.pedidoModelo.obtenerTodosLosPedidos(
                id_usuario
            );
            return res.json(pedidos);
        } catch (error) {
            return res.status(500).json({
                error: "Error al obtener los pedidos",
                detalles: error.message,
            });
        }
    };
}