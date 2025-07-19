import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Header = () => (
    <View style={styles.headerContainer}>
        <View style={styles.headerLogoContainer}>
            <Image
                source={require('../../assets/3d.png')} // Ruta del logo actualizada
                style={styles.headerLogo}
            />
            <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode='tail'>Pa' la olla</Text>
        </View>
        <View style={styles.headerButtonsContainer}>
            <TouchableOpacity style={styles.loginButton}>
                <Icon name="log-in" size={16} color="#f97316" />
                <Text style={styles.loginButtonText}>Acceder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerButton}>
                <Text style={styles.registerButtonText}>Registrar</Text>
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
});

export default Header;
