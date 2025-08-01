import React, { useState } from 'react';
import {
	View,
	Text,
	Image,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
    Alert, 
    ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, } from '../../services/api'; 
import logoPaLaOlla from '../../../assets/3d.png';

export default function Login() {
    const navigation = useNavigation();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        setLoading(true);

        try {
            const userData = await loginUser(email, password);
            
            await AsyncStorage.setItem('usuario', JSON.stringify(userData));

            Alert.alert('Éxito', '¡Has iniciado sesión correctamente!');
            
            navigation.navigate('HomeScreen');

        } catch (error) {
            Alert.alert('Error de Inicio de Sesión', error.message);
        } finally {
            setLoading(false);
        }
    };

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<ScrollView contentContainerStyle={styles.scrollViewContent}>
				<View style={styles.contentWrapper}>
					<View style={styles.headerSection}>
						<TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
							<Text style={styles.backButtonText}>&larr; Volver</Text>
						</TouchableOpacity>
						<Image source={logoPaLaOlla} style={styles.logo} />
						<Text style={styles.title}>Pa' la olla</Text>
						<Text style={styles.subtitle}>Iniciar Sesión</Text>
					</View>

					<View style={styles.card}>
						<Text style={styles.cardTitle}>Bienvenido de vuelta</Text>
						<View style={styles.form}>
							<View style={styles.inputGroup}>
								<Text style={styles.label}>Email</Text>
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
								<Text style={styles.label}>Contraseña</Text>
								<TextInput
									style={styles.input}
									placeholder="Tu contraseña"
									secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
								/>
							</View>
							<TouchableOpacity
								style={styles.loginButton}
								onPress={handleLogin}
                                disabled={loading} 
							>
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
								    <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                                )}
							</TouchableOpacity>
						</View>
						<Text style={styles.registerText}>
							¿No tienes cuenta?{' '}
							<TouchableOpacity onPress={() => navigation.navigate('Register')}>
								<Text style={styles.registerLink}>Regístrate aquí</Text>
							</TouchableOpacity>
						</Text>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#FFFBEB' },
	scrollViewContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
	contentWrapper: { width: '100%', maxWidth: 400, paddingHorizontal: 24 },
	headerSection: { alignItems: 'center', marginBottom: 24 },
	backButton: { alignSelf: 'flex-start', marginBottom: 8 },
	backButtonText: { fontSize: 14, color: '#B91C1C' },
	logo: { width: 64, height: 64, marginBottom: 8, resizeMode: 'contain' },
	title: { fontSize: 24, fontWeight: 'bold', color: '#B91C1C' },
	subtitle: { fontSize: 16, color: '#C82C2C', marginTop: 8 },
	card: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5, borderRadius: 12, padding: 24 },
	cardTitle: { textAlign: 'center', fontSize: 20, fontWeight: '600', color: '#B91C1C', marginBottom: 16 },
	form: { rowGap: 16 },
	inputGroup: {},
	label: { fontSize: 14, fontWeight: '500', color: '#B91C1C', marginBottom: 4 },
	input: { height: 40, borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 6, paddingHorizontal: 12 },
	loginButton: { width: '100%', backgroundColor: '#EA580C', paddingVertical: 12, borderRadius: 6, alignItems: 'center', marginTop: 16, minHeight: 44 },
	loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
	registerText: { textAlign: 'center', fontSize: 14, color: '#4B5563', marginTop: 16 },
	registerLink: { color: '#DC2626', fontWeight: '500' }
});
