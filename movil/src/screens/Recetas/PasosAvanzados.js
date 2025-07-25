import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from "@react-navigation/native";
import { WebView } from 'react-native-webview';
import WhatsAppButton from '../../components/WhatsAppButton';

const PasosAvanzados = () => {
  const route = useRoute();
  const { receta } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Título */}
        <View style={styles.header}>
          <Text style={styles.title}>{receta.nombre_receta}</Text>
          <Text style={styles.subtitle}>
            Receta completa con vídeo tutorial y pasos detallados
          </Text>
          <View style={styles.tagsContainer}>
            <Text style={styles.tag}>👨‍👩‍👧‍👦 {receta.receta_cantidad} personas</Text>
            <Text style={styles.tag}>🥄 {receta.receta_nivel}</Text>
          </View>
        </View>

        {/* Video Tutorial */}
        <View style={styles.videoCard}>
          <Text style={styles.videoTitle}>▶️ Vídeo Tutorial</Text>
          <Text style={styles.videoSubtitle}>
            Cómo preparar {receta.nombre_receta}
          </Text>
          <Text style={styles.videoDesc}>Vídeo paso a paso de la preparación</Text>

          <View style={{ height: 200, borderRadius: 10, overflow: 'hidden' }}>
            <WebView
              source={{ uri: receta.video }}
              allowsFullscreenVideo
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* Ingredientes y Pasos */}
        <View style={styles.row}>
          <View style={styles.cardRed}>
            <Text style={styles.sectionTitle}>🍴 Ingredientes</Text>
            {receta.niveles?.[receta.receta_nivel]?.[`${receta.receta_cantidad}_personas`]?.ingredientes?.map((ingrediente, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientText}>
                  <Text style={styles.ingredientNumber}>{index + 1}. </Text>
                  {ingrediente}
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

          <View style={styles.cardPink}>
            <Text style={styles.sectionTitle}>📋 Preparación Paso a Paso</Text>
            {receta.niveles?.[receta.receta_nivel]?.[`${receta.receta_cantidad}_personas`]?.paso_a_paso?.map((paso_a_paso, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientText}>
                  <Text style={styles.ingredientNumber}>{index + 1}. </Text>
                  {paso_a_paso}
                </Text>
              </View>
            ))}
            <View style={styles.tipBox}>
              <Text style={styles.tipText}>
                ✅ ¡Listo! Tu {receta.nombre_receta} está preparado para servir
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón flotante de WhatsApp */}
      <View style={styles.whatsappButton}>
        <WhatsAppButton />
      </View>
    </View>
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
  whatsappButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
});
