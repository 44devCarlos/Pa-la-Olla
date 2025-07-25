import React, { useState, useEffect, use } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
	ActivityIndicator,
	ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LevelCard } from "../../components/LevelCard";
import { createOrder } from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import { Linking } from "react-native";

const OrdenarPedido = () => {
	const route = useRoute();
	const { receta, arrayPrecios } = route.params;
	const navigation = useNavigation();

	const [cantidad, setCantidad] = useState(2); // valores posibles: 2, 4, 6
	const [nivel, setNivel] = useState(null);
	const [total, setTotal] = useState("0.00");
	const [usuario, setUsuario] = useState(null);
	const [direccion, setDireccion] = useState("");
	const [formularioCompleto, setFormularioCompleto] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (nivel !== null) {
			const indexNivel = [
				"principiante",
				"intermedio",
				"avanzado",
			].indexOf(nivel);
			const precio = obtenerPrecio(indexNivel);
			setTotal(precio);
		}
	}, [cantidad]);

	useEffect(() => {
		const cargarDatosUsuario = async () => {
			try {
				const userString = await AsyncStorage.getItem("usuario");
				if (userString) {
					const userData = JSON.parse(userString);
					setUsuario(userData);
				}
			} catch (error) {
				console.error("Error al cargar datos del usuario:", error);
			}
		};
		cargarDatosUsuario();
	}, []);

	useEffect(() => {
		const verificarFormulario = () => {
			if (direccion.trim() !== "" && nivel !== null) {
				setFormularioCompleto(true);
			} else {
				setFormularioCompleto(false);
			}
		};

		verificarFormulario();
	}, [direccion, nivel]);

	const aumentar = () => {
		if (cantidad < 6) setCantidad(cantidad + 2);
	};

	const disminuir = () => {
		if (cantidad > 2) setCantidad(cantidad - 2);
	};

	const getPosicion = () => {
		return cantidad / 2 - 1; // 2 -> 0, 4 -> 1, 6 -> 2
	};

	const obtenerPrecio = (nivelIndex) => {
		const posicion = getPosicion();
		if (
			Array.isArray(arrayPrecios) &&
			arrayPrecios[posicion] &&
			arrayPrecios[posicion][nivelIndex]
		) {
			return Number(arrayPrecios[posicion][nivelIndex].precio).toFixed(2);
		}
		return "0.00";
	};

	const seleccionarNivel = (nivelSeleccionado, nivelIndex) => {
		setNivel(nivelSeleccionado);
		const precio = obtenerPrecio(nivelIndex);
		setTotal(precio);
	};

	const registrarPedido = async () => {
		if (!usuario || !direccion || !nivel) {
			// Manejar error: falta información
			Alert.alert(
				"Error",
				"Por favor, completa todos los campos antes de realizar el pedido."
			);
			return;
		}

		const orderData = {
			id_usuario: usuario.id_usuario,
			id_receta: receta.id_receta,
			orden_paypal: null,
			precio: total,
			receta_nivel: nivel,
			receta_cantidad: cantidad,
			direccion: direccion,
			descripcion: `Pedido de ${receta.nombre_receta} - ${cantidad} personas, Nivel: ${nivel}`,
			receta: receta,
		};

		try {
			setLoading(true);
			const resultado = await createOrder(orderData);
			if (resultado.status === "CREATED") {
				const ordenData = {
					...orderData,
					orden_paypal: resultado.id,
				};
				// Guardar el pedido pendiente en AsyncStorage
				await AsyncStorage.setItem(
					"pedidoPendiente",
					JSON.stringify(ordenData)
				);
				// Manejar éxito
				Linking.openURL(resultado.links[1].href); // Abre la URL de PayPal
			}
		} catch (error) {
			// Manejar error
			Alert.alert(
				"Error",
				"No se pudo crear el pedido. Inténtalo de nuevo."
			);
		}
	};

	if (loading) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.centeredContainer}>
					<ActivityIndicator size="large" color="#991b1b" />
					<Text style={styles.loadingText}>
						Dirigiendo a Paypal...
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.titulo}>Ordenar {receta?.nombre_receta}</Text>

			<View style={styles.seccion}>
				<Text style={styles.subtitulo}>Cantidad de personas:</Text>
				<View style={styles.controles}>
					<TouchableOpacity style={styles.boton} onPress={disminuir}>
						<Text style={styles.botonTexto}>-</Text>
					</TouchableOpacity>
					<Text style={styles.cantidadTexto}>{cantidad}</Text>
					<TouchableOpacity style={styles.boton} onPress={aumentar}>
						<Text style={styles.botonTexto}>+</Text>
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.seccion}>
				<Text style={styles.subtitulo}>Nivel de preparación:</Text>

				{["principiante", "intermedio", "avanzado"].map(
					(label, index) => (
						<LevelCard
							key={label}
							label={label}
							index={index}
							obtenerPrecio={obtenerPrecio}
							seleccionarNivel={seleccionarNivel}
							nivel={nivel}
						/>
					)
				)}
			</View>

			<View style={styles.totalBox}>
				<Text style={styles.totalLabel}>Total del pedido:</Text>
				<Text style={styles.totalValor}>${total}</Text>
			</View>

			<View style={styles.container}>
				<Text style={styles.seccionTitulo}>
					Información de Contacto
				</Text>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Nombre completo:</Text>
					<TextInput
						style={styles.input}
						value={usuario?.nombre_usuario || ""}
						editable={false}
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Teléfono:</Text>
					<TextInput
						style={styles.input}
						value={usuario?.telefono || ""}
						editable={false}
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Dirección:</Text>
					<TextInput
						style={styles.input}
						placeholder="Tu dirección"
						value={direccion}
						onChangeText={setDireccion}
					/>
				</View>

				{formularioCompleto && (
					<View style={styles.paypalContainer}>
						<TouchableOpacity
							onPress={() => {
								registrarPedido();
								// Aquí podrías redirigir a la pantalla de PayPal si es necesario
							}}
							style={styles.paypalButton}>
							<Text style={styles.paypalButtonText}>
								Pagar con PayPal
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: "#fff7ed" },
	centeredContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	loadingText: { marginTop: 10, fontSize: 16, color: "#4b5563" },
	container: {
		padding: 20,
		backgroundColor: "#fff",
	},
	titulo: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 16,
		color: "#7f1d1d",
	},
	seccion: {
		marginBottom: 20,
	},
	subtitulo: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 10,
		color: "#7f1d1d",
	},
	controles: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	boton: {
		backgroundColor: "#f97316",
		padding: 10,
		borderRadius: 8,
		marginHorizontal: 20,
	},
	botonTexto: {
		fontSize: 20,
		color: "#fff",
	},
	cantidadTexto: {
		fontSize: 20,
		fontWeight: "bold",
	},
	imagen: {
		width: 30,
		height: 30,
		marginRight: 10,
		borderRadius: 5,
	},
	totalBox: {
		marginTop: 30,
		padding: 16,
		borderWidth: 1,
		borderColor: "#fca5a5",
		borderRadius: 10,
		backgroundColor: "#fef2f2",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	totalLabel: {
		fontWeight: "600",
		fontSize: 16,
		color: "#7f1d1d",
	},
	totalValor: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#ea580c",
	},
	sectionTitulo: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#7f1d1d",
	},
	inputGroup: {
		marginBottom: 15,
	},
	label: {
		fontWeight: "bold",
		color: "#7f1d1d",
	},
	input: {
		borderWidth: 1,
		borderColor: "#fca5a5",
		borderRadius: 5,
		padding: 10,
		backgroundColor: "#fff",
	},
	paypalContainer: {
		marginTop: 20,
	},
	paypalButton: {
		backgroundColor: "#0070ba",
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
	},
	paypalButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
});

export default OrdenarPedido;
