import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postRecipeComment } from "../services/api";
import StarRating from "./StarRating"; // Asegúrate de que este componente esté importado correctamente

const CommentsSection = ({ recipeId, initialComments, onCommentPosted }) => {
	const [commentText, setCommentText] = useState("");
	// Aquí podrías añadir un estado para una calificación con estrellas
	const [rating, setRating] = useState(5);

	const handleSubmitComment = async () => {
		const userString = await AsyncStorage.getItem("usuario");
		if (!userString) {
			Alert.alert(
				"Inicia Sesión",
				"Debes iniciar sesión para dejar un comentario."
			);
			return;
		}
		if (!commentText.trim()) {
			Alert.alert(
				"Comentario Vacío",
				"Por favor, escribe un comentario."
			);
			return;
		}

		const user = JSON.parse(userString);
		const commentData = {
			id_usuario: user.id_usuario,
			id_receta: recipeId,
			descripcion: commentText,
			calificacion: rating,
		};

		try {
			await postRecipeComment(commentData);
			Alert.alert("¡Gracias!", "Tu comentario ha sido publicado.");
			setCommentText("");
			onCommentPosted(); // Llama a la función para recargar los comentarios y ratings
		} catch (error) {
			Alert.alert("Error", "No se pudo publicar tu comentario.");
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.subtitle}>Comentarios y Calificaciones</Text>

			<View style={styles.commentForm}>
				<Text style={styles.formTitle}>Deja tu Comentario</Text>
				<TextInput
					placeholder="Cuéntanos qué te pareció..."
					multiline
					style={styles.input}
					value={commentText}
					onChangeText={setCommentText}
				/>
				{/* Aquí podrías añadir un componente de estrellas para seleccionar el rating como <StarRating /> */}
				<StarRating value={rating} onChange={setRating} />
				<Text style={styles.hintText}>Mantén para media estrella</Text>
				<TouchableOpacity
					style={styles.submitButton}
					onPress={handleSubmitComment}>
					<Text style={styles.submitButtonText}>
						Enviar Comentario
					</Text>
				</TouchableOpacity>
			</View>

			<Text style={styles.subtitle}>Todos los comentarios</Text>
			{initialComments.length > 0 ? (
				// FIX: Usamos el id_comentario o el índice como key para asegurar que sea único
				initialComments.map((comment, index) => (
					<View
						key={comment.id_comentario || index.toString()}
						style={styles.comment}>
						<Text style={styles.commentName}>
							{comment.nombre_usuario}
						</Text>
						<Text style={styles.commentRating}>
							{parseFloat(comment.calificacion).toFixed(1)} ⭐
						</Text>
						<Text style={styles.commentDate}>
							{new Date(
								comment.fecha_comentario
							).toLocaleDateString()}
						</Text>
						<Text style={styles.commentText}>
							{comment.descripcion}
						</Text>
					</View>
				))
			) : (
				<Text style={styles.noCommentsText}>
					Aún no hay comentarios. ¡Sé el primero!
				</Text>
			)}
		</View>
	);
};

// ... (Estilos adaptados)
const styles = StyleSheet.create({
	container: { padding: 16, paddingTop: 0 },
	subtitle: {
		marginTop: 24,
		fontSize: 20,
		fontWeight: "700",
		color: "#7f1d1d",
		marginBottom: 16,
	},
	commentForm: {
		backgroundColor: "#fff",
		padding: 16,
		borderRadius: 10,
		elevation: 2,
	},
	formTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		padding: 10,
		marginBottom: 12,
		height: 80,
		textAlignVertical: "top",
	},
	submitButton: {
		backgroundColor: "#F21B4E",
		padding: 12,
		borderRadius: 6,
		alignItems: "center",
	},
	submitButtonText: { color: "white", fontWeight: "600" },
	comment: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 12,
		marginTop: 12,
		elevation: 2,
	},
	commentName: { fontWeight: "bold" },
	commentRating: { position: "absolute", right: 12, top: 12, fontSize: 14 },
	commentDate: { fontSize: 12, color: "#6b7280", marginVertical: 2 },
	commentText: { marginTop: 4 },
	noCommentsText: { textAlign: "center", color: "#6b7280", marginTop: 20 },
	hintText: { fontSize: 12, color: "#6b7280", marginBottom: 12 },
});

export default CommentsSection;
