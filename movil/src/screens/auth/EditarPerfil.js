import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateUser } from "../../services/api"; // Asumo que tendrás una función similar para actualizar
import logoPaLaOlla from "../../../assets/icon.png";

export default function EditarPerfil() {
  const navigation = useNavigation();

  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [originalUser, setOriginalUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Cargar datos del usuario al iniciar la pantalla
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("usuario");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setOriginalUser(parsedUser);
          setNombre(parsedUser.nombre_usuario || "");
          setEmail(parsedUser.email || "");
          setTelefono(parsedUser.telefono || "");
        }
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar tus datos.");
      } finally {
        setInitialLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleUpdate = async () => {
    if (!nombre || !email) {
      Alert.alert("Error", "El nombre y el email son obligatorios.");
      return;
    }
    if (password && password.length < 6) {
      Alert.alert(
        "Error",
        "La nueva contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    setLoading(true);
    try {
      const dataToUpdate = {
        id_usuario: originalUser.id_usuario,
        nombre: nombre,
        email: email,
        telefono: telefono,
      };

      if (password.trim() !== "") {
        dataToUpdate.password = password;
      }

      // 1. Llama a la API para actualizar la base de datos
      await updateUser(dataToUpdate);

      // 2. Construye manualmente el objeto de usuario actualizado para guardarlo localmente
      const updatedUserForStorage = {
        ...originalUser, // Usa el usuario original como base para no perder datos
        nombre_usuario: nombre, // Actualiza los campos con los nuevos valores del formulario
        email: email,
        telefono: telefono,
      };

      // 3. Guarda el objeto de usuario COMPLETO y CORRECTO en AsyncStorage
      await AsyncStorage.setItem(
        "usuario",
        JSON.stringify(updatedUserForStorage)
      );

      Alert.alert("¡Éxito!", "Tus datos han sido actualizados correctamente.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert(
        "Error al Actualizar",
        error.message ||
          "No se pudieron guardar los cambios. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B91C1C" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.wrapper}>
          <View style={styles.headerSection}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>&larr; Volver</Text>
            </TouchableOpacity>
            <Image source={logoPaLaOlla} style={styles.logo} />
            <Text style={styles.title}>Pa' la olla</Text>
            <Text style={styles.subtitle}>Actualizar Datos</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Editar Perfil</Text>
            <Text style={styles.infoText}>
              Deja el campo de contraseña vacío si no deseas cambiarla.
            </Text>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre completo *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tu nombre completo"
                  value={nombre}
                  onChangeText={setNombre}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+507 1234-5678"
                  keyboardType="phone-pad"
                  value={telefono}
                  onChangeText={setTelefono}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nueva Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdate}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.updateButtonText}>Actualizar Datos</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBEB",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  wrapper: { width: "100%", maxWidth: 400, paddingHorizontal: 24 },
  headerSection: { alignItems: "center", marginBottom: 24 },
  backButton: { alignSelf: "flex-start", marginBottom: 8, padding: 8 },
  backButtonText: { fontSize: 16, color: "#B91C1C", fontWeight: "500" },
  logo: { width: 64, height: 64, marginBottom: 8, resizeMode: "contain" },
  title: { fontSize: 24, fontWeight: "bold", color: "#B91C1C" },
  subtitle: { fontSize: 16, color: "#C53030", marginTop: 8 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#B91C1C",
    marginBottom: 8,
  },
  infoText: {
    textAlign: "center",
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 16,
  },
  form: { rowGap: 16 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "500", color: "#B91C1C", marginBottom: 4 },
  input: {
    height: 40,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
  },
  updateButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 16,
    minHeight: 44,
  },
  updateButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
