import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, } from 'react-native';

const ingredientes = [
  '1 pollo entero cortado en presas',
  '2 tazas de arroz',
  '4 tazas de caldo de pollo',
  '1 cebolla',
  '1 pimiento verde',
  '3 dientes de ajo',
  '1/2 taza de guisantes',
  'Azafrán o culantro para color',
  'Hojas de bijao',
  'Sal y pimienta',
];

const pasos = [
  'Sofríe el pollo hasta dorar',
  'Agregar cebolla, ajo y pimiento',
  'Incorporar el arroz y tostar ligeramente',
  'Añadir el caldo caliente y azafrán',
  'Cocinar tapado por 25 minutos',
  'Agregar guisantes en los últimos 5 minutos',
  'Decorar con hojas de bijao al servir',
];

const PasosAvanzados = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Título */}
      <View style={styles.header}>
        <Text style={styles.title}>Arroz con Pollo Panameño</Text>
        <Text style={styles.subtitle}>
          Receta completa con vídeo tutorial y pasos detallados
        </Text>
        <View style={styles.tagsContainer}>
          <Text style={styles.tag}>⏱️ 1 hora</Text>
          <Text style={styles.tag}>👨‍👩‍👧‍👦 6 personas</Text>
          <Text style={styles.tag}>🥄 Intermedio</Text>
        </View>
      </View>

      {/* Video Tutorial */}
      <View style={styles.videoCard}>
        <Text style={styles.videoTitle}>▶️ Vídeo Tutorial</Text>
        <Text style={styles.videoSubtitle}>
          Cómo preparar Arroz con Pollo Panameño
        </Text>
        <Text style={styles.videoDesc}>Vídeo paso a paso de la preparación</Text>
        <TouchableOpacity style={styles.videoButton}>
          <Text style={styles.videoButtonText}>▶ Reproducir Video</Text>
        </TouchableOpacity>
        <Text style={styles.videoDuration}>Duración: 1 hora • HD Quality</Text>
      </View>

      {/* Ingredientes y Pasos */}
      <View style={styles.row}>
        {/* Ingredientes */}
        <View style={styles.cardRed}>
          <Text style={styles.sectionTitle}>🍴 Ingredientes</Text>
          {ingredientes.map((item, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.ingredientText}>
                <Text style={styles.ingredientNumber}>{index + 1}. </Text>
                {item}
              </Text>
            </View>
          ))}
          <View style={styles.tipBox}>
            <Text style={styles.tipText}>
              🍳 <Text style={{ fontWeight: 'bold' }}>Consejo del Chef:</Text>{'\n'}
              Todos los ingredientes deben estar a temperatura ambiente antes de comenzar la preparación para mejores resultados.
            </Text>
          </View>
        </View>

        {/* Pasos */}
        <View style={styles.cardPink}>
          <Text style={styles.sectionTitle}>📋 Preparación Paso a Paso</Text>
          {pasos.map((item, index) => (
            <Text key={index} style={styles.stepText}>
              {index + 1}. {item}
            </Text>
          ))}
          <View style={styles.tipBox}>
            <Text style={styles.tipText}>
              ✅ ¡Listo! Tu Arroz con Pollo Panameño está preparado para servir
            </Text>
          </View>
        </View>
      </View>

      {/* Consejos adicionales */}
      <View style={styles.adviceBox}>
        <View style={styles.adviceColumn}>
          <Text style={styles.adviceTitle}>🍳 Técnicas de Cocción</Text>
          <Text style={styles.adviceItem}>• Cocina a fuego medio para evitar que se pegue</Text>
          <Text style={styles.adviceItem}>• Revuelve ocasionalmente para distribución uniforme</Text>
          <Text style={styles.adviceItem}>• Prueba y ajusta sazón al final</Text>
        </View>
        <View style={styles.adviceColumn}>
          <Text style={styles.adviceTitle}>🍽️ Sugerencias de Servicio</Text>
          <Text style={styles.adviceItem}>• Sirve inmediatamente mientras esté caliente</Text>
          <Text style={styles.adviceItem}>• Acompaña con arroz blanco</Text>
          <Text style={styles.adviceItem}>• Decora con cilantro fresco picado</Text>
        </View>
      </View>

      {/* Botones */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.fillButton}>
          <Text style={styles.fillButtonText}>Explorar Más Recetas</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        ¿Te gustó esta receta? ¡Compártela con tu familia y amigos!
      </Text>
    </ScrollView>
  );
};

export default PasosAvanzados;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffefc',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7f1d1d',
  },
  subtitle: {
    fontSize: 14,
    color: '#a94442',
    marginTop: 4,
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  tag: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    margin: 4,
    fontSize: 12,
  },
  videoCard: {
    backgroundColor: '#7f1d1d',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
  },
  videoTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  videoSubtitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  videoDesc: {
    fontSize: 12,
    color: '#fce4ec',
    marginBottom: 12,
  },
  videoButton: {
    backgroundColor: '#facc15',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  videoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  videoDuration: {
    marginTop: 8,
    fontSize: 12,
    color: '#ffecb3',
  },
  row: {
    gap: 20,
  },
  cardRed: {
    backgroundColor: '#fff1f2',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardPink: {
    backgroundColor: '#ffe4e6',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#b91c1c',
  },
  ingredientItem: {
    backgroundColor: '#fff',
    borderColor: '#facc15',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 13,
  },
  ingredientNumber: {
    color: '#facc15',
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 13,
    marginBottom: 8,
    color: '#7f1d1d',
  },
  tipBox: {
    backgroundColor: '#fef9c3',
    borderColor: '#facc15',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  tipText: {
    fontSize: 13,
    color: '#92400e',
  },
  adviceBox: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    flexDirection: 'column',
    gap: 16,
    marginBottom: 24,
  },
  adviceColumn: {},
  adviceTitle: {
    fontWeight: 'bold',
    color: '#b91c1c',
    marginBottom: 6,
  },
  adviceItem: {
    color: '#7f1d1d',
    fontSize: 13,
    marginBottom: 4,
  },
  buttonContainer: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  outlineButton: {
    borderColor: '#7f1d1d',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  outlineButtonText: {
    color: '#7f1d1d',
    fontSize: 13,
    fontWeight: '500',
  },
  fillButton: {
    backgroundColor: '#7f1d1d',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  fillButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  footerText: {
    fontSize: 12,
    color: '#a94442',
    textAlign: 'center',
    marginBottom: 40,
  },
});
