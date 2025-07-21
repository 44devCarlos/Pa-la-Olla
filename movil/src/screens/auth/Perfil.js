import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    StatusBar, // Importa StatusBar para obtener la altura de la barra de notificaciones
    Platform // Importa Platform para diferenciar entre iOS y Android
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { fetchOrderCount, fetchCommentCount } from "../../services/api";

const Perfil = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [user, setUser] = useState(null);
    const [orderCount, setOrderCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            setLoading(true);
            try {
                const storedUser = await AsyncStorage.getItem("usuario");
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);

                    const [orders, comments] = await Promise.all([
                        fetchOrderCount(parsedUser.id_usuario),
                        fetchCommentCount(parsedUser.id_usuario),
                    ]);
                    setOrderCount(orders);
                    setCommentCount(comments);
                } else {
                    navigation.navigate("Login");
                }
            } catch (error) {
                console.error("Error al cargar datos del perfil:", error);
                Alert.alert("Error", "No se pudieron cargar los datos del perfil.");
            } finally {
                setLoading(false);
            }
        };

        if (isFocused) {
            loadUserData();
        }
    }, [isFocused]);

    const handleLogout = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que quieres cerrar tu sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sí, cerrar sesión",
                    onPress: async () => {
                        await AsyncStorage.removeItem("usuario");
                        navigation.navigate("HomeScreen");
                    },
                    style: "destructive",
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#7F1D1D" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>&larr; Volver</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={require("../../../assets/user.png")}
                            style={styles.avatar}
                        />
                    </View>
                    <Text style={styles.username}>
                        {user?.nombre_usuario || "Usuario"}
                    </Text>
                    <Text style={styles.status}>Cliente Activo</Text>
                </View>

                <View style={styles.infoWrapper}>
                    <View style={styles.box}>
                        <Text style={styles.boxTitle}>Información Personal</Text>
                        <Text style={styles.boxText}>Correo: {user?.email}</Text>
                        <Text style={styles.boxText}>Teléfono: {user?.telefono}</Text>
                        <TouchableOpacity style={styles.mainButton}
                            onPress={() => navigation.navigate("EditarPerfil")}
                        >
                            <Text style={styles.mainButtonText}>Editar Perfil</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.box}>
                        <Text style={styles.boxTitle}>Estadísticas</Text>
                        <View style={styles.row}>
                            <Text>Pedidos</Text>
                            <Text style={styles.badge}>{orderCount}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text>Reseñas</Text>
                            <Text style={styles.badge}>{commentCount}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.largeBox}>
                    <Text style={styles.boxTitle}>Pedidos Recientes</Text>
                    <View style={styles.recentOrder}>
                        <View>
                            <Text style={styles.orderTitle}>Sancocho Panameño</Text>
                            <Text style={styles.orderSubtitle}>
                                Pedido #PA001 • 15 de julio de 2025
                            </Text>
                        </View>
                        <View style={styles.orderButtons}>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Ver Receta</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Ver Detalles</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    

                    <TouchableOpacity style={styles.mainButton}>
                        <Text style={styles.mainButtonText}>Ver Todos los Pedidos</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.mainButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FAFAF9",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    container: { 
        flex: 1, 
        backgroundColor: "#FAFAF9", 
        paddingHorizontal: 16 
    },
    centeredContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAFAF9",
    },
    profileSection: { 
        alignItems: "center", 
        marginBottom: 24, 
    },
    avatarContainer: {
        backgroundColor: "#F59E0B",
        borderRadius: 100,
        padding: 4,
        marginBottom: 8,
    },
    avatar: { width: 80, height: 80, borderRadius: 40 },
    username: { fontSize: 24, fontWeight: "bold", color: "#7F1D1D" },
    status: {
        backgroundColor: "#F59E0B",
        color: "#fff",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 6,
        fontSize: 12,
    },
    infoWrapper: { gap: 16 },
    box: {
        backgroundColor: "#FFFFFF",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    largeBox: {
        backgroundColor: "#FFFFFF",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    boxTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#7F1D1D",
    },
    boxText: { fontSize: 14, color: "#4B5563", marginBottom: 4 },
    row: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
    badge: {
        backgroundColor: "#FBBF24",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        fontSize: 12,
        color: "#000",
    },
    recentOrder: {
        backgroundColor: "#F3F4F6",
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 16,
    },
    orderTitle: { fontWeight: "600", fontSize: 15, color: "#1F2937" },
    orderSubtitle: { fontSize: 12, color: "#7F1D1D", marginTop: 2 },
    orderButtons: {
        flexDirection: "row",
        gap: 8,
        marginTop: 12,
        justifyContent: "flex-end",
    },
    button: {
        backgroundColor: "#F97316",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    buttonText: { color: "#fff", fontSize: 12, fontWeight: "600" },
    mainButton: {
        backgroundColor: "#F97316",
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 12,
        alignItems: "center",
    },
    logoutButton: {backgroundColor: "#ef4444",paddingVertical: 12,borderRadius: 8,marginTop: 8,alignItems: "center",},
    mainButtonText: { color: "#fff", fontWeight: "600" },
    backButton: { alignSelf: "flex-start",paddingVertical: 8 },
    backButtonText: { fontSize: 14,color: "#B91C1C", fontWeight: '500'},
});

export default Perfil;
