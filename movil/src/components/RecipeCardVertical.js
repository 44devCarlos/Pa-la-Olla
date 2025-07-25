import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { useNavigation } from '@react-navigation/native';

const RecipeCardVertical = ({ recipe }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('Descripcion', { receta: recipe });
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <Image source={{ uri: recipe.imagen_receta }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.title}>{recipe.nombre_receta}</Text>
                <Text style={styles.description} numberOfLines={3}>{recipe.descripcion_receta}</Text>
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoText}>{recipe.rango_precio}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Icon name="clock" size={14} color="#991b1b" />
                        <Text style={styles.infoText}>{recipe.rango_tiempo}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Icon name="users" size={14} color="#991b1b" />
                        <Text style={styles.infoText}>{recipe.rango_porciones}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: { backgroundColor: '#ffffff', borderRadius: 16, overflow: 'hidden', marginHorizontal: 16, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4 },
    image: { width: '100%', height: 180 },
    content: { padding: 16 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#991b1b', marginBottom: 8 },
    description: { color: '#4b5563', marginBottom: 12, fontSize: 14, lineHeight: 20 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 12, marginTop: 'auto' },
    infoItem: { flexDirection: 'row', alignItems: 'center' },
    infoText: { color: '#4b5563', marginLeft: 6, fontSize: 12, fontWeight: '500' },
});

export default RecipeCardVertical;
