import { API_URL } from "../../movil/src/services/api.js";
import {
	PORT,
	PAYPAL_CLIENT_ID,
	PAYPAL_CLIENT_SECRET,
	PAYPAL_API,
} from "../config.js";
export class ControladorPedido {
	constructor({ pedidoModelo }) {
		this.pedidoModelo = pedidoModelo;
	}

	registrarPedido = async (req, res) => {
		const {
			id_usuario,
			id_receta,
			orden_paypal,
			precio,
			receta_nivel,
			receta_cantidad,
			direccion,
		} = req.body;

		if (
			!id_usuario ||
			!id_receta ||
			!orden_paypal ||
			!precio ||
			!receta_nivel ||
			!receta_cantidad ||
			!direccion
		) {
			return res
				.status(400)
				.json({ error: "Todos los campos son requeridos" });
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
	};

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

	crearOrdenPaypal = async (req, res) => {
		try {
			// Obtener token de acceso
			const credentials = Buffer.from(
				`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
			).toString("base64");

			const tokenResponse = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Basic ${credentials}`,
				},
				body: "grant_type=client_credentials",
			});

			const tokenData = await tokenResponse.json();

			if (!tokenData.access_token) {
				return res.status(500).json({
					error: "No se pudo obtener token de acceso",
					detalles: tokenData,
				});
			}

			const access_token = tokenData.access_token;

			// Crear orden
			const order = {
				intent: "CAPTURE",
				purchase_units: [
					{
						amount: {
							currency_code: "USD",
							value: req.body.precio,
						},
						description: req.body.descripcion,
					},
				],
				application_context: {
					brand_name: "Pa La Olla",
					landing_page: "NO_PREFERENCE",
					user_action: "PAY_NOW",
					return_url: `exp://${API_URL}:8081/--/descripcion?status=crear&from=paypal`,
					cancel_url: `exp://${API_URL}:8081/--/descripcion?status=cancelar`,
				},
			};

			const orderResponse = await fetch(
				`${PAYPAL_API}/v2/checkout/orders`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${access_token}`,
					},
					body: JSON.stringify(order),
				}
			);

			const orderData = await orderResponse.json();
			console.log("Datos de la orden:", orderData);

			if (orderResponse.ok) {
				return res.json({ order: orderData });
			} else {
				return res.status(500).json({
					error: "Error al crear la orden de PayPal",
					detalles: orderData,
				});
			}
		} catch (error) {
			return res.status(500).json({
				error: "Excepción al crear orden PayPal",
				detalles: error.message,
			});
		}
	};

	capturarOrdenPaypal = async (req, res) => {
		const { token } = req.query;

		if (!token) {
			return res.status(400).json({ error: "ID de orden requerido" });
		}

		try {
			// Obtener token de acceso
			const credentials = Buffer.from(
				`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
			).toString("base64");

			const tokenResponse = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Basic ${credentials}`,
				},
				body: "grant_type=client_credentials",
			});

			const tokenData = await tokenResponse.json();

			if (!tokenData.access_token) {
				return res.status(500).json({
					error: "No se pudo obtener token de acceso",
					detalles: tokenData,
				});
			}

			const access_token = tokenData.access_token;

			const captureResponse = await fetch(
				`${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${access_token}`,
					},
				}
			);

			const captureData = await captureResponse.json();
			console.log(
				"Datos de captura:",
				captureData.purchase_units[0].payments
			);
			if (captureData.status === "COMPLETED") {
				// Aquí se registra el pedido en la base de datos
				const orden_paypal = captureData.id;
				const {
					id_usuario,
					id_receta,
					receta_nivel,
					receta_cantidad,
					direccion,
				} = req.body;
				const precio =
					captureData.purchase_units[0].payments.captures[0].amount
						.value;
				const resultado = await this.pedidoModelo.registrarPedido(
					id_usuario,
					id_receta,
					orden_paypal,
					precio,
					receta_nivel,
					receta_cantidad,
					direccion
				);

				return res.json({
					mensaje: "Orden capturada y pedido registrado exitosamente",
					data: resultado,
				});
			} else {
				return res.status(500).json({
					error: "Error al capturar la orden de PayPal",
					detalles: captureData,
				});
			}
		} catch (error) {
			return res.status(500).json({
				error: "Excepción al capturar orden PayPal",
				detalles: error.message,
			});
		}
	};

	cancelarOrdenPaypal = (req, res) => {
		// Aquí puedes manejar la lógica para cancelar una orden de PayPal si es necesario
		return res.status(200).json({ mensaje: "Orden cancelada" });
	};
}
