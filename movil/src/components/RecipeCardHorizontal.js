import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const RecipeCardHorizontal = ({ recipe }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('Descripcion', { receta: recipe });
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <Image source={{ uri: recipe.imagen_receta }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{recipe.nombre_receta}</Text>
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Icon name="dollar-sign" size={14} color="#991b1b" />
                        <Text style={styles.infoText}>{recipe.rango_precio}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    card: { width: 280, backgroundColor: '#ffffff', borderRadius: 16, overflow: 'hidden', marginRight: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4 },
    image: { width: '100%', height: 150 },
    content: { padding: 12 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#991b1b' },
    infoRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 12, marginTop: 12 },
    infoItem: { flexDirection: 'row', alignItems: 'center' },
    infoText: { color: '#4b5563', marginLeft: 6, fontSize: 12, fontWeight: '500' },
});

export default RecipeCardHorizontal;
