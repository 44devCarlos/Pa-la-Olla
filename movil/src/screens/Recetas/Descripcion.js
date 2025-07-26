import React, { useState, useEffect } from "react";
import {
	ScrollView,
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	Alert,
	TouchableOpacity,
} from "react-native";
import {
	fetchRecipeRatings,
	fetchRecipeComments,
	fetchPrices,
	captureOrder,
} from "../../services/api";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import RecipeInfo from "../../components/RecipeInfo";
import CommentsSection from "../../components/CommentsSection";
import WhatsAppButton from "../../components/WhatsAppButton";
import { Linking } from "react-native";

const Descripcion = () => {
	const route = useRoute();
	const navigation = useNavigation();
	const { receta, status } = route.params;

	const [recetaFinal, setRecetaFinal] = useState({});
	const [ratings, setRatings] = useState({});
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [datosPrecios, setdatosPrecios] = useState([]);
	const [idReceta, setIdReceta] = useState(null);

	useEffect(() => {
		const subscription = Linking.addEventListener(
			"url",
			async ({ url }) => {
				try {
					const pedidoPendienteString = await AsyncStorage.getItem(
						"pedidoPendiente"
					);

					if (
						pedidoPendienteString &&
						url.includes("descripcion?status=crear")
					) {
						const pedidoPendienteData = JSON.parse(
							pedidoPendienteString
						);

						const resultado = await captureOrder(
							pedidoPendienteData
						);
						if (resultado) {
							console.log(
								"Pedido registrado correctamente al volver de PayPal"
							);
							await AsyncStorage.removeItem("pedidoPendiente");
						}
						navigation.reset({
							index: 0,
							routes: [{ name: "HomeScreen" }],
						});
					} else if (
						pedidoPendienteString &&
						url.includes("descripcion?status=cancelar")
					) {
						navigation.reset({
							index: 1,
							routes: [
								{ name: "HomeScreen" },
								{ name: "Descripcion", params: { receta } },
							],
						});
					}
				} catch (error) {
					console.error(
						"Error al manejar redirección desde PayPal:",
						error
					);
				}
			}
		);

		return () => {
			subscription.remove();
		};
	}, []);

	useEffect(() => {
		const getPedidoYReceta = async () => {
			try {
				let recetaFinal = receta;

				if (!recetaFinal || !recetaFinal.id_receta) return;

				setRecetaFinal(recetaFinal);
				setIdReceta(recetaFinal.id_receta);
			} catch (error) {
				console.error(
					"Error cargando pedido pendiente o receta:",
					error
				);
				Alert.alert(
					"Error",
					"Hubo un problema al cargar los datos de la receta."
				);
			}
		};

		getPedidoYReceta();
	}, []);

	const loadRecipeDetails = async () => {
		if (!idReceta) return;

		setLoading(true);
		try {
			const [ratingsData, commentsData, pricesData] = await Promise.all([
				fetchRecipeRatings(idReceta),
				fetchRecipeComments(idReceta),
				fetchPrices(idReceta),
			]);
			setRatings(ratingsData);
			setComments(commentsData);
			setdatosPrecios(pricesData[0]);
		} catch (error) {
			Alert.alert(
				"Error",
				"No se pudieron cargar los detalles de la receta."
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadRecipeDetails();
	}, [idReceta]);

	const handleOrder = () => {
		const arrayPrecios = [
			[
				{
					nivel: "Principiante",
					precio: datosPrecios.principiante_2 || 0,
				},
				{
					nivel: "Intermedio",
					precio: datosPrecios.intermedio_2 || 0,
				},
				{
					nivel: "Avanzado",
					precio: datosPrecios.avanzado_2 || 0,
				},
			],
			[
				{
					nivel: "Principiante",
					precio: datosPrecios.principiante_4 || 0,
				},
				{
					nivel: "Intermedio",
					precio: datosPrecios.intermedio_4 || 0,
				},
				{
					nivel: "Avanzado",
					precio: datosPrecios.avanzado_4 || 0,
				},
			],
			[
				{
					nivel: "Principiante",
					precio: datosPrecios.principiante_6 || 0,
				},
				{
					nivel: "Intermedio",
					precio: datosPrecios.intermedio_6 || 0,
				},
				{
					nivel: "Avanzado",
					precio: datosPrecios.avanzado_6 || 0,
				},
			],
		];
		navigation.navigate("OrdenarPedido", { receta, arrayPrecios });
	};

	if (loading) {
		return (
			<View style={styles.centeredContainer}>
				<ActivityIndicator size="large" color="#7F1D1D" />
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<ScrollView style={styles.container}>
				<RecipeInfo receta={recetaFinal} ratings={ratings} />
				<TouchableOpacity
					style={styles.orderButton}
					title="Ordenar Pedido"
					onPress={handleOrder}>
					<Text style={styles.orderButtonText}>Ordenar Pedido</Text>
				</TouchableOpacity>
				{idReceta ? (
					<CommentsSection
						recipeId={recetaFinal.id_receta}
						initialComments={comments}
						onCommentPosted={loadRecipeDetails} // Función para recargar todo al postear
					/>
				) : null}
			</ScrollView>
			<WhatsAppButton style={styles.whatsappButton} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#fff7f4" },
	centeredContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	orderButton: {
		backgroundColor: "#F21B4E",
		padding: 12,
		borderRadius: 6,
		alignItems: "center",
		margin: 16,
	},
	orderButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	whatsappButton: {
		position: "absolute",
		bottom: 20,
		right: 20,
		zIndex: 10,
	},
});

export default Descripcion;
