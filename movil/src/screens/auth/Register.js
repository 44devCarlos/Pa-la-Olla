import React, { useState } from 'react';
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
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { registerUser } from '../../services/api'; 
import logoPaLaOlla from '../../../assets/icon.png';

export default function Register() {
    const navigation = useNavigation();

    // Estados para cada campo del formulario
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        // Validaciones básicas
        if (!nombre || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Los campos con * son obligatorios.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setLoading(true);
        try {
            const userData = { nombre, email, telefono, password };
            await registerUser(userData);
            
            Alert.alert(
                '¡Éxito!',
                'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );

        } catch (error) {
            Alert.alert('Error de Registro', error.message);
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
				<View style={styles.wrapper}>
					<View style={styles.headerSection}>
						<TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
							<Text style={styles.backButtonText}>&larr; Volver</Text>
						</TouchableOpacity>
						<Image source={logoPaLaOlla} style={styles.logo} />
						<Text style={styles.title}>Pa' la olla</Text>
						<Text style={styles.subtitle}>Crear Cuenta</Text>
					</View>

					<View style={styles.card}>
						<Text style={styles.cardTitle}>Registrarse</Text>
						<View style={styles.form}>
							<View style={styles.inputGroup}>
								<Text style={styles.label}>Nombre completo *</Text>
								<TextInput style={styles.input} placeholder="Tu nombre completo" value={nombre} onChangeText={setNombre} />
							</View>
							<View style={styles.inputGroup}>
								<Text style={styles.label}>Email *</Text>
								<TextInput style={styles.input} placeholder="tu@email.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
							</View>
							<View style={styles.inputGroup}>
								<Text style={styles.label}>Teléfono</Text>
								<TextInput style={styles.input} placeholder="+507 1234-5678" keyboardType="phone-pad" value={telefono} onChangeText={setTelefono} />
							</View>
							<View style={styles.inputGroup}>
								<Text style={styles.label}>Contraseña *</Text>
								<TextInput style={styles.input} placeholder="Mínimo 6 caracteres" secureTextEntry value={password} onChangeText={setPassword} />
							</View>
							<View style={styles.inputGroup}>
								<Text style={styles.label}>Confirmar Contraseña *</Text>
								<TextInput style={styles.input} placeholder="Repite tu contraseña" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
							</View>
							<TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
								    <Text style={styles.registerButtonText}>Crear Cuenta</Text>
                                )}
							</TouchableOpacity>
						</View>
						<Text style={styles.loginText}>
							¿Ya tienes cuenta?{' '}
							<Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
								Iniciar sesión
							</Text>
						</Text>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#FFFBEB' },
	scrollViewContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
	wrapper: { width: '100%', maxWidth: 400, paddingHorizontal: 24 },
	headerSection: { alignItems: 'center', marginBottom: 24 },
	backButton: { alignSelf: 'flex-start', marginBottom: 8 },
	backButtonText: { fontSize: 14, color: '#B91C1C' },
	logo: { width: 64, height: 64, marginBottom: 8, resizeMode: 'contain' },
	title: { fontSize: 24, fontWeight: 'bold', color: '#B91C1C' },
	subtitle: { fontSize: 16, color: '#C53030', marginTop: 8 },
	card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 },
	cardTitle: { textAlign: 'center', fontSize: 20, fontWeight: '600', color: '#B91C1C', marginBottom: 16 },
	form: { rowGap: 16 },
	inputGroup: { marginBottom: 12 },
	label: { fontSize: 14, fontWeight: '500', color: '#B91C1C', marginBottom: 4 },
	input: { height: 40, borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 6, paddingHorizontal: 12, backgroundColor: '#FFF' },
	registerButton: { backgroundColor: '#DC2626', paddingVertical: 12, borderRadius: 6, alignItems: 'center', marginTop: 16, minHeight: 44 },
	registerButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
	loginText: { textAlign: 'center', fontSize: 14, color: '#4B5563', marginTop: 16 },
	loginLink: { color: '#DC2626', fontWeight: '500' },
});
