import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const StarRating = ({
	maxStars = 5,
	onChange,
	value = 0,
	readOnly = false,
	size = 32,
}) => {
	const [rating, setRating] = useState(value);

	useEffect(() => {
		setRating(value);
	}, [value]);

	const handlePress = (index, isHalf) => {
		if (readOnly) return;
		const newRating = isHalf ? index + 0.5 : index + 1;
		setRating(newRating);
		onChange?.(newRating);
	};

	const renderStar = (index) => {
		if (rating >= index + 1) {
			return <FontAwesome name="star" size={size} color="#FBBF24" />;
		} else if (rating >= index + 0.5) {
			return (
				<FontAwesome
					name="star-half-empty"
					size={size}
					color="#FBBF24"
				/>
			);
		} else {
			return <FontAwesome name="star-o" size={size} color="#D1D5DB" />;
		}
	};

	return (
		<View style={styles.container}>
			{Array.from({ length: maxStars }, (_, index) => (
				<TouchableOpacity
					key={index}
					onPress={() => handlePress(index, false)}
					onLongPress={() => handlePress(index, true)} // usa long press para media estrella
					disabled={readOnly}>
					{renderStar(index)}
				</TouchableOpacity>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		marginBottom: 16,
	},
});

export default StarRating;
