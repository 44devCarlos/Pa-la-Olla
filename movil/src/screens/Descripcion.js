import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, TextInput, FlatList, StyleSheet, Dimensions, } from 'react-native';

const { width } = Dimensions.get('window');

export default function DescripcionScreen() {
  const receta = {
    nombre_receta: 'Sancocho Panameño',
    descripcion_receta: 'Una sopa tradicional muy sabrosa.',
    imagen_receta: 'https://via.placeholder.com/400x300',
    alergenos_receta: 'Gluten, Lácteos',
    rango_tiempo: '45 min',
    rango_porciones: '4 porciones',
    rango_precio: '$$',
  };

  const calificaciones = {
    calificacion_promedio: 4.5,
    total_comentario: 3,
  };

  const otrasRecetas = new Array(5).fill({
    nombre_receta: 'Arroz con Pollo',
    descripcion_receta: 'Delicioso y fácil de preparar.',
    imagen_receta: 'https://via.placeholder.com/150',
    rango_tiempo: '30 min',
    rango_porciones: '3',
    rango_precio: '$',
  });

  const comentarios = [
    {
      nombre: 'Carlos',
      descripcion: '¡Muy rica la receta!',
      fecha_comentario: '2024-05-10',
      calificacion: 5,
    },
    {
      nombre: 'Ana',
      descripcion: 'Le faltó un poco de sal.',
      fecha_comentario: '2024-05-11',
      calificacion: 4,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: receta.imagen_receta }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{receta.nombre_receta}</Text>
        <Text style={styles.description}>{receta.descripcion_receta}</Text>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkButtonText}>📋 Información de Alérgenos</Text>
        </TouchableOpacity>
        <Text style={styles.badge}>{receta.alergenos_receta}</Text>

        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>🛒 Ordenar Ahora</Text>
        </TouchableOpacity>

        <View style={styles.metricsContainer}>
          <Metric label="Tiempo" value={receta.rango_tiempo} />
          <Metric label="Porciones" value={receta.rango_porciones} />
          <Metric label="Rating" value={calificaciones.calificacion_promedio.toFixed(1)} />
          <Metric label="Precio" value={receta.rango_precio} />
        </View>

        <Text style={styles.subtitle}>Otras Recetas que te Podrían Gustar</Text>
        <FlatList
          horizontal
          data={otrasRecetas}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imagen_receta }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{item.nombre_receta}</Text>
              <Text style={styles.cardText}>{item.descripcion_receta}</Text>
              <Text style={styles.cardText}>⏱ {item.rango_tiempo}</Text>
              <Text style={styles.cardText}>🍽 {item.rango_porciones}</Text>
              <Text style={styles.cardText}>💵 {item.rango_precio}</Text>
            </View>
          )}
        />

        <Text style={styles.subtitle}>Comentarios y Calificaciones</Text>
        <View style={styles.ratingBox}>
          <Text style={styles.ratingText}>
            {calificaciones.calificacion_promedio.toFixed(1)} ⭐
          </Text>
          <Text style={styles.commentCount}>
            {calificaciones.total_comentario} reseñas
          </Text>
        </View>

        <Text style={styles.label}>Deja tu Comentario</Text>
        <TextInput
          placeholder="Cuéntanos qué te pareció..."
          multiline
          style={styles.input}
        />
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Enviar Comentario</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Todos los comentarios</Text>
        {comentarios.map((comentario, i) => (
          <View key={i} style={styles.comment}>
            <Text style={styles.commentName}>{comentario.nombre}</Text>
            <Text>{comentario.calificacion} ⭐</Text>
            <Text style={styles.commentDate}>{comentario.fecha_comentario}</Text>
            <Text style={styles.commentText}>{comentario.descripcion}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function Metric({ label, value }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text>📋</Text>
      <Text>{label}</Text>
      <Text style={{ fontWeight: 'bold', color: '#7f1d1d' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff7f4',
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7f1d1d',
    marginBottom: 12,
  },
  description: {
    color: '#991b1b',
    marginBottom: 8,
  },
  linkButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  linkButtonText: {
    fontWeight: '600',
    color: '#7f1d1d',
  },
  badge: {
    backgroundColor: '#fecaca',
    color: '#7f1d1d',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
    fontSize: 12,
  },
  orderButton: {
    marginTop: 16,
    backgroundColor: '#F21B4E',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  orderButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
  },
  subtitle: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: '700',
    color: '#7f1d1d',
  },
  card: {
    width: width * 0.6,
    backgroundColor: '#fff',
    marginRight: 16,
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginTop: 6,
  },
  cardText: {
    fontSize: 12,
  },
  ratingBox: {
    marginTop: 16,
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ea580c',
  },
  commentCount: {
    fontSize: 14,
    color: '#d97706',
  },
  label: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    marginBottom: 12,
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#F21B4E',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  comment: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  commentName: {
    fontWeight: 'bold',
  },
  commentDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  commentText: {
    marginTop: 4,
  },
});
