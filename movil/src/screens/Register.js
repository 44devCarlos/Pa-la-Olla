import React from 'react';
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
} from 'react-native';
import logoPaLaOlla from '../assets/icon.png'; // ajusta la ruta si es necesario

export default function Register() {
	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<ScrollView contentContainerStyle={styles.scrollViewContent}>
				<View style={styles.wrapper}>
					<View style={styles.headerSection}>
						<TouchableOpacity style={styles.backButton}>
							<Text style={styles.backButtonText}>&larr; Volver</Text>
						</TouchableOpacity>
						<Image source={logoPaLaOlla} style={styles.logo} />
						<Text style={styles.title}>Pa' la olla</Text>
						<Text style={styles.subtitle}>Crear Cuenta</Text>
						<Text style={styles.description}>
							Únete a Pa' la olla y disfruta las mejores recetas
						</Text>
					</View>

					<View style={styles.card}>
						<Text style={styles.cardTitle}>Registrarse</Text>

						<View style={styles.form}>
							{/* Nombre completo */}
							<View style={styles.inputGroup}>
								<Text style={styles.label}>Nombre completo *</Text>
								<TextInput style={styles.input} placeholder="Tu nombre completo" />
							</View>

							{/* Email */}
							<View style={styles.inputGroup}>
								<Text style={styles.label}>Email *</Text>
								<TextInput
									style={styles.input}
									placeholder="tu@email.com"
									keyboardType="email-address"
									autoCapitalize="none"
								/>
							</View>

							{/* Teléfono */}
							<View style={styles.inputGroup}>
								<Text style={styles.label}>Teléfono</Text>
								<TextInput
									style={styles.input}
									placeholder="+507 1234-5678"
									keyboardType="phone-pad"
								/>
							</View>

							{/* Dirección */}
							<View style={styles.inputGroup}>
								<Text style={styles.label}>Dirección</Text>
								<TextInput
									style={[styles.input, styles.textArea]}
									placeholder="Tu dirección para entregas"
									multiline
									numberOfLines={2}
								/>
							</View>

							{/* Contraseña */}
							<View style={styles.inputGroup}>
								<Text style={styles.label}>Contraseña *</Text>
								<TextInput
									style={styles.input}
									placeholder="Mínimo 6 caracteres"
									secureTextEntry
								/>
							</View>

							{/* Confirmar contraseña */}
							<View style={styles.inputGroup}>
								<Text style={styles.label}>Confirmar Contraseña *</Text>
								<TextInput
									style={styles.input}
									placeholder="Repite tu contraseña"
									secureTextEntry
								/>
							</View>

							<TouchableOpacity
								style={styles.registerButton}
								onPress={() => console.log('Crear Cuenta presionado')}
							>
								<Text style={styles.registerButtonText}>Crear Cuenta</Text>
							</TouchableOpacity>
						</View>

						<Text style={styles.loginText}>
							¿Ya tienes cuenta?{' '}
							<Text
								style={styles.loginLink}
								onPress={() => console.log('Ir a login')}
							>
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
	container: {
		flex: 1,
		backgroundColor: '#FFFBEB', // Gradiente simulación de amber-50
	},
	scrollViewContent: {
		flexGrow: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 20,
	},
	wrapper: {
		width: '100%',
		maxWidth: 400,
		paddingHorizontal: 24,
	},
	headerSection: {
		alignItems: 'center',
		marginBottom: 24,
	},
	backButton: {
		alignSelf: 'flex-start',
		marginBottom: 8,
	},
	backButtonText: {
		fontSize: 14,
		color: '#B91C1C',
	},
	logo: {
		width: 64,
		height: 64,
		marginBottom: 8,
		resizeMode: 'contain',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#B91C1C',
	},
	subtitle: {
		fontSize: 16,
		color: '#C53030',
		marginTop: 8,
	},
	description: {
		fontSize: 14,
		color: '#6B7280',
		textAlign: 'center',
		marginTop: 4,
	},
	card: {
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 24,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 4,
	},
	cardTitle: {
		textAlign: 'center',
		fontSize: 20,
		fontWeight: '600',
		color: '#B91C1C',
		marginBottom: 16,
	},
	form: {
		rowGap: 16,
	},
	inputGroup: {
		marginBottom: 12,
	},
	label: {
		fontSize: 14,
		fontWeight: '500',
		color: '#B91C1C',
		marginBottom: 4,
	},
	input: {
		height: 40,
		borderColor: '#D1D5DB',
		borderWidth: 1,
		borderRadius: 6,
		paddingHorizontal: 12,
		backgroundColor: '#FFF',
	},
	textArea: {
		height: 80,
		textAlignVertical: 'top',
	},
	registerButton: {
		backgroundColor: '#DC2626',
		paddingVertical: 12,
		borderRadius: 6,
		alignItems: 'center',
		marginTop: 16,
	},
	registerButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
	loginText: {
		textAlign: 'center',
		fontSize: 14,
		color: '#4B5563',
		marginTop: 16,
	},
	loginLink: {
		color: '#DC2626',
		fontWeight: '500',
	},
});
