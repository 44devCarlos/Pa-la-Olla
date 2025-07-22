import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Metric = ({ icon, label, value }) => (
  <View style={styles.metricItem}>
    <Icon name={icon} size={20} color="#7f1d1d" />
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

const RecipeInfo = ({ receta, ratings }) => {
    const avgRating = parseFloat(ratings.calificacion_promedio).toFixed(1);

    return (
        <View>
            <Image source={{ uri: receta.imagen_receta }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.title}>{receta.nombre_receta}</Text>
                <Text style={styles.description}>{receta.descripcion_receta}</Text>
                
                <Text style={styles.allergenTitle}>📋 Información de Alérgenos</Text>
                <Text style={styles.badge}>{receta.alergenos_receta}</Text>

                <View style={styles.metricsContainer}>
                    <Metric icon="clock" label="Tiempo" value={receta.rango_tiempo} />
                    <Metric icon="users" label="Porciones" value={receta.rango_porciones} />
                    <Metric icon="star" label="Rating" value={isNaN(avgRating) ? 'N/A' : avgRating} />
                    <Metric icon="dollar-sign" label="Precio" value={receta.rango_precio} />
                </View>
            </View>
        </View>
    );
};

// ... (Estilos adaptados de tu archivo Descripcion.js)
const styles = StyleSheet.create({
    image: { width: '100%', height: 250 },
    content: { padding: 16 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#7f1d1d', marginBottom: 12 },
    description: { color: '#991b1b', marginBottom: 8, fontSize: 16, lineHeight: 22 },
    allergenTitle: { marginTop: 10, fontWeight: '600', color: '#7f1d1d', fontSize: 16 },
    badge: { backgroundColor: '#fecaca', color: '#7f1d1d', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 6, alignSelf: 'flex-start', fontSize: 12, fontWeight: '500' },
    metricsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 24, backgroundColor: '#fff', padding: 12, borderRadius: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
    metricItem: { alignItems: 'center', gap: 4 },
    metricLabel: { fontSize: 12, color: '#4b5563' },
    metricValue: { fontWeight: 'bold', color: '#7f1d1d' },
});

export default RecipeInfo;
