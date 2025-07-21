import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, } from 'react-native';

const EditarPerfil = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Logo y Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backText}>&larr; Volver</Text>
        </TouchableOpacity>
        <Image
          source={require('../../assets/user.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Pa' la olla</Text>
        <Text style={styles.subtitle}>Actualizar datos</Text>
        <Text style={styles.note}>
          Puedes dejar el campo de la contraseña vacío si no deseas cambiarla. Si deseas cambiarla, coloca la nueva.
        </Text>
      </View>

      {/* Formulario */}
      <View style={styles.form}>
        <Text style={styles.label}>Nombre completo *</Text>
        <TextInput
          placeholder="Tu nombre completo"
          style={styles.input}
        />

        <Text style={styles.label}>Email *</Text>
        <TextInput
          placeholder="tu@email.com"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          placeholder="+507 1234-5678"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>Actualizar datos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditarPerfil;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7ed',
  },
  content: {
    alignItems: 'center',
    padding: 26,
  },
  header: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 30,
    marginTop:50,
  },
  backText: {
    color: '#991b1b',
    fontSize: 14,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#991b1b',
  },
  subtitle: {
    fontSize: 16,
    color: '#b91c1c',
    marginTop: 4,
  },
  note: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 14,
    color: '#991b1b',
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
