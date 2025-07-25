import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export const LevelCard = ({
	label,
	index,
	obtenerPrecio,
	seleccionarNivel,
	nivel,
}) => {
	return (
		<TouchableOpacity
			key={label}
			style={[
				styles.nivelItem,
				nivel === label && styles.nivelItemSeleccionado,
			]}
			onPress={() => seleccionarNivel(label, index)}>
			<View style={{ flex: 1 }}>
				<Text style={styles.nivelTitulo}>
					{label.charAt(0).toUpperCase() + label.slice(1)}
				</Text>
				<Text style={styles.nivelDescripcion}>
					{index === 0
						? "Preparación sencilla"
						: index === 1
						? "Preparación moderada"
						: "Preparación avanzada"}
				</Text>
			</View>
			<Text style={styles.precio}>${obtenerPrecio(index)}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	nivelItem: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#fca5a5",
		padding: 10,
		borderRadius: 10,
		marginBottom: 10,
	},
	nivelItemSeleccionado: {
		borderColor: "#dc2626",
		backgroundColor: "#fee2e2",
	},
	nivelTitulo: {
		fontWeight: "bold",
		color: "#7f1d1d",
	},
	nivelDescripcion: {
		fontSize: 12,
		color: "#7f1d1d",
	},
	precio: {
		fontWeight: "bold",
		color: "#ea580c",
	},
});
