import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('usuario');
                setUser(userData ? JSON.parse(userData) : null);
            } catch (error) {
                console.error("Error al leer los datos del usuario:", error);
                setUser(null);
            }
        };

        checkUser();
    }, [isFocused]);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('usuario');
        setUser(null);
        navigation.navigate('HomeScreen');
    };

    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerLogoContainer}>
                <Image
                    source={require('../../assets/3d.png')}
                    style={styles.headerLogo}
                />
                <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode='tail'>Pa' la olla</Text>
            </View>

            {/* Condición: Muestra una vista u otra dependiendo si el usuario existe */}
            {user ? (
                // Vista para usuario con sesión iniciada
                <View style={styles.headerButtonsContainer}>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => navigation.navigate('Perfil')}
                    >
                        <Icon name="user" size={20} color="#991b1b" />
                        <Text style={styles.profileButtonText}>
                            {user.nombre_usuario || 'Perfil'} 
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // Vista para usuario sin sesión
                <View style={styles.headerButtonsContainer}>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Icon name="log-in" size={16} color="#f97316" />
                        <Text style={styles.loginButtonText}>Acceder</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.registerButtonText}>Registrar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#fff7ed',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLogoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        marginRight: 8,
    },
    headerLogo: {
        width: 40,
        height: 40,
        marginRight: 8
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#991b1b',
        flexShrink: 1,
    },
    headerButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#f97316',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginRight: 6,
    },
    loginButtonText: {
        color: '#f97316',
        fontWeight: '600',
        marginLeft: 6,
        fontSize: 14,
    },
    registerButton: {
        backgroundColor: '#ef4444',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    registerButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    profileButton: {
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#fee2e2',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginRight: 8,
    },
    profileButtonText: {
        marginLeft: 8,
        color: '#991b1b',
        fontWeight: 'bold',
        fontSize: 14,
    },
    logoutButton: {
        padding: 8,
    }
});

export default Header;