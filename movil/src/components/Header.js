import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Header = () => (
    <View style={styles.headerContainer}>
        <View style={styles.headerLogoContainer}>
            <Image
                source={require('../../assets/3d.png')} // Asumiendo que tu logo se llama 'logo.png'
                style={styles.headerLogo}
            />
            <Text style={styles.headerTitle}>Pa' la olla</Text>
        </View>
        <View style={styles.headerButtonsContainer}>
            <TouchableOpacity style={styles.loginButton}>
                <Icon name="log-in" size={16} color="#f97316" />
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerButton}>
                <Text style={styles.registerButtonText}>Registrarse</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    headerContainer: { 
        backgroundColor: '#fff7ed', 
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLogoContainer: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    headerLogo: { 
        width: 40, 
        height: 40, 
        marginRight: 8 
    },
    headerTitle: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#991b1b' 
    },
    headerButtonsContainer: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    loginButton: { 
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#f97316',
        borderRadius: 12,
        paddingVertical: 10, 
        paddingHorizontal: 16,
        marginRight: 8,
    },
    loginButtonText: { 
        color: '#f97316', 
        fontWeight: '600', 
        marginLeft: 6 
    },
    registerButton: { 
        backgroundColor: '#ef4444', 
        borderRadius: 12, 
        paddingVertical: 10, 
        paddingHorizontal: 16,
    },
    registerButtonText: { 
        color: '#ffffff', 
        fontWeight: 'bold' 
    },
});

export default Header;
