import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from "react-native";
import WhatsAppButton from '../../components/WhatsAppButton';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { fetchOrdersByUser } from "../../services/api";

const HistorialPedidos = () => {
    const navigation = useNavigation();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPedidos = async () => {
            try {
                const userData = await AsyncStorage.getItem("usuario");
                if (!userData) return navigation.navigate("Login");
                const user = JSON.parse(userData);

                const orders = await fetchOrdersByUser(user.id_usuario);
                setPedidos(orders);
            } catch (error) {
                console.error("Error al cargar pedidos:", error);
                Alert.alert("Error", "No se pudieron cargar los pedidos.");
            } finally {
                setLoading(false);
            }
        };

        loadPedidos();
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#7F1D1D" />
            </View>
        );
    }

    return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                {pedidos.length === 0 ? (
                    <Text style={styles.emptyText}>No hay pedidos disponibles.</Text>
                ) : (
                    pedidos.map((pedido) => (
                        <View key={pedido.id_pedido} style={styles.card}>
                            <Text style={styles.name}>{pedido.nombre_receta}</Text>
                            <Text style={styles.details}>Pedido #{pedido.id_pedido}</Text>
                            <Text style={styles.details}>
                                Fecha: {new Date(pedido.fecha_pedido).toLocaleDateString()}
                            </Text>

                            <View style={styles.actions}>
                                <TouchableOpacity style={styles.button}>
                                    <Text
                                        style={styles.buttonText}
                                        onPress={() => {
                                            if (pedido.receta_nivel.toLowerCase() === "principiante") {
                                                navigation.navigate("PasosFacil", { receta: pedido });
                                            } else {
                                                navigation.navigate("PasosAvanzados", { receta: pedido });
                                            }
                                        }}
                                    >
                                        Ver Receta
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() =>
                                        navigation.navigate("DetallePedido", {
                                            pedidoId: pedido.id_pedido,
                                        })
                                    }
                                >
                                    <Text style={styles.buttonText}>Ver Detalles</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Botón flotante de WhatsApp */}
            <View style={styles.whatsappContainer}>
                <WhatsAppButton />
            </View>
        </View>
    </SafeAreaView>
);
};

const styles = StyleSheet.create({
    whatsappContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10,
},
    container: { padding: 16, backgroundColor: "#FAFAF9" },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#7F1D1D",
        marginBottom: 16,
    },
    emptyText: { textAlign: "center", color: "#6B7280", marginTop: 20 },
    card: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    name: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
    details: { fontSize: 12, color: "#6B7280", marginTop: 4 },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 8,
        marginTop: 12,
    },
    button: {
        backgroundColor: "#F97316",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 12 },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAFAF9",
    },
});

export default HistorialPedidos;