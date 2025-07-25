import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchOrdersByUser } from "../../services/api";

const DetallePedido = () => {
    const route = useRoute();
    const { pedidoId } = route.params;

    const [pedido, setPedido] = useState(null);
    const [user, setUser] = useState(null); // ← aquí guardamos el usuario
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPedido = async () => {
            try {
                const userData = await AsyncStorage.getItem("usuario");
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser); // ← lo guardamos en el estado

                const pedidos = await fetchOrdersByUser(parsedUser.id_usuario);
                const pedidoEncontrado = pedidos.find(
                    (p) => p.id_pedido === pedidoId
                );
                if (!pedidoEncontrado) {
                    Alert.alert("Error", "Pedido no encontrado");
                } else {
                    setPedido(pedidoEncontrado);
                }
            } catch (error) {
                console.error("Error al cargar pedido:", error);
                Alert.alert("Error", "No se pudo cargar el pedido.");
            } finally {
                setLoading(false);
            }
        };

        loadPedido();
    }, [pedidoId]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#7F1D1D" />
            </View>
        );
    }

    if (!pedido) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Pedido no encontrado</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.label}>Nombre:</Text>
                <Text style={styles.value}>{user?.nombre_usuario || "Usuario"}</Text>

                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user?.email || "Usuario"}</Text>

                <Text style={styles.label}>Teléfono:</Text>
                <Text style={styles.value}>{user?.telefono || "Usuario"}</Text>

                <Text style={styles.label}>ID Pedido:</Text>
                <Text style={styles.value}>{pedido.id_pedido}</Text>

                <Text style={styles.label}>Orden de Paypal:</Text>
                <Text style={styles.value}>{pedido.orden_paypal}</Text>

                <Text style={styles.label}>Fecha del Pedido:</Text>
                <Text style={styles.value}>{new Date(pedido.fecha_pedido).toLocaleDateString()}</Text>

                <Text style={styles.label}>Direccion:</Text>
                <Text style={styles.value}>{pedido.direccion}</Text>

                <Text style={styles.label}>Nombre Receta:</Text>
                <Text style={styles.value}>{pedido.nombre_receta}</Text>

                <Text style={styles.label}>Nivel:</Text>
                <Text style={styles.value}>{pedido.receta_nivel}</Text>

                <Text style={styles.label}>Cantidad:</Text>
                <Text style={styles.value}>{pedido.receta_cantidad} Personas</Text>

                <Text style={styles.label}>Total:</Text>
                <Text style={styles.value}>${Number(pedido.precio).toFixed(2)}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: "#FAFAF9" },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#7F1D1D",
        marginBottom: 16,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    label: {
        fontWeight: "bold",
        color: "#374151",
        marginTop: 10,
    },
    value: {
        color: "#4B5563",
        fontSize: 14,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAFAF9",
    },
    errorText: {
        color: "#DC2626",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default DetallePedido;
