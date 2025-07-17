import { StatusBar } from "expo-status-bar";
import React from 'react';
import {
	View,
	Text,
	Image,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView, // Usamos ScrollView para que el contenido sea desplazable si es necesario
	KeyboardAvoidingView, // Para manejar el teclado en iOS/Android
	Platform // Para detectar la plataforma y ajustar KeyboardAvoidingView
} from 'react-native';

// Importa tu imagen, React Native lo maneja de forma diferente a la web
// Asegúrate de que la ruta sea correcta desde este archivo
import logoPaLaOlla from '../assets/icon.png';

export default function Login() {
	return (
		// KeyboardAvoidingView para que el teclado no oculte los inputs
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			{/* ScrollView para asegurar que el contenido sea desplazable si la pantalla es pequeña */}
			<ScrollView contentContainerStyle={styles.scrollViewContent}>
				<View style={styles.contentWrapper}>
					<View style={styles.headerSection}>
						{/* TouchableOpacity para el botón "Volver" */}
						<TouchableOpacity style={styles.backButton}>
							<Text style={styles.backButtonText}>&larr; Volver</Text>
						</TouchableOpacity>
						<Image source={logoPaLaOlla} style={styles.logo} />
						<Text style={styles.title}>Pa' la olla</Text>
						<Text style={styles.subtitle}>Iniciar Sesión</Text>
						<Text style={styles.description}>
							Entra a tu cuenta para hacer pedidos
						</Text>
					</View>

					<View style={styles.card}>
						<Text style={styles.cardTitle}>
							Bienvenido de vuelta
						</Text>
						<View style={styles.form}>
							<View style={styles.inputGroup}>
								<Text style={styles.label}>
									Email
								</Text>
								<TextInput
									style={styles.input}
									placeholder="tu@email.com"
									keyboardType="email-address" // Teclado optimizado para email
									autoCapitalize="none" // No capitalizar automáticamente
								/>
							</View>
							<View style={styles.inputGroup}>
								<Text style={styles.label}>
									Contraseña
								</Text>
								<TextInput
									style={styles.input}
									placeholder="Tu contraseña"
									secureTextEntry // Oculta el texto de la contraseña
								/>
							</View>
							<TouchableOpacity
								style={styles.loginButton}
								onPress={() => console.log('Iniciar Sesión presionado')} // Agrega lógica al presionar
							>
								<Text style={styles.loginButtonText}>
									Iniciar Sesión
								</Text>
							</TouchableOpacity>
						</View>
						<Text style={styles.registerText}>
							¿No tienes cuenta?{' '}
							{/* TouchableOpacity para enlaces */}
							<TouchableOpacity onPress={() => console.log('Registrarse presionado')}>
								<Text style={styles.registerLink}>
									Regístrate aquí
								</Text>
							</TouchableOpacity>
						</Text>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

// --- Estilos React Native ---
// Se usan objetos JavaScript para los estilos en lugar de clases de Tailwind
const styles = StyleSheet.create({
	container: {
		flex: 1, // Ocupa toda la altura disponible
		backgroundColor: '#FAFAFA', // neutral-50
	},
	scrollViewContent: {
		flexGrow: 1, // Permite que el ScrollView crezca y ocupe el espacio
		justifyContent: 'center', // Centra el contenido verticalmente
		alignItems: 'center', // Centra el contenido horizontalmente
		paddingVertical: 20, // Añade un poco de padding vertical
	},
	contentWrapper: {
		width: '100%',
		maxWidth: 400, // max-w-md, ajusta según necesites
		paddingHorizontal: 24, // px-6
	},
	headerSection: {
		alignItems: 'center', // items-center
		marginBottom: 24, // mb-6
	},
	backButton: {
		alignSelf: 'flex-start', // self-start
		marginBottom: 8, // mb-2
	},
	backButtonText: {
		fontSize: 14, // text-sm
		color: '#B91C1C', // red-800
	},
	logo: {
		width: 64, // w-16
		height: 64, // h-16
		marginBottom: 8, // mb-2
		resizeMode: 'contain', // Asegura que la imagen se adapte bien
	},
	title: {
		fontSize: 24, // text-2xl
		fontWeight: 'bold',
		color: '#B91C1C', // red-800
	},
	subtitle: {
		fontSize: 16, // text-base
		color: '#C82C2C', // red-700
		marginTop: 8, // mt-2
	},
	description: {
		fontSize: 14, // text-sm
		color: '#6B7280', // gray-500
		textAlign: 'center', // text-center
	},
	card: {
		backgroundColor: '#FFFFFF', // bg-white
		shadowColor: '#000', // shadow-lg
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 5, // Android shadow
		borderRadius: 12, // rounded-xl
		padding: 24, // p-6
	},
	cardTitle: {
		textAlign: 'center', // text-center
		fontSize: 20, // text-xl
		fontWeight: '600', // font-semibold
		color: '#B91C1C', // red-800
		marginBottom: 16, // mb-4
	},
	form: {
		rowGap: 16, // space-y-4 (para espaciar elementos flex en columna)
	},
	inputGroup: {
		// Para el div que contiene label e input
	},
	label: {
		fontSize: 14, // text-sm
		fontWeight: '500', // font-medium
		color: '#B91C1C', // red-800
		marginBottom: 4, // Pequeño espacio debajo del label
	},
	input: {
		height: 40, // Altura del input
		borderColor: '#D1D5DB', // border-gray-300
		borderWidth: 1,
		borderRadius: 6, // rounded-md
		paddingHorizontal: 12, // p-2
		// focus:outline-none focus:ring-2 focus:ring-red-300: Se maneja con librerías o eventos
	},
	loginButton: {
		width: '100%', // w-full
		backgroundColor: '#EA580C', // orange-600
		paddingVertical: 12, // py-2
		borderRadius: 6, // rounded-md
		alignItems: 'center', // Centra el texto del botón
		marginTop: 16, // Espacio para separar del último input
	},
	loginButtonText: {
		color: '#FFFFFF', // text-white
		fontSize: 16, // Tamaño de fuente para el botón
		fontWeight: 'bold', // Un poco más de énfasis
	},
	registerText: {
		textAlign: 'center', // text-center
		fontSize: 14, // text-sm
		color: '#4B5563', // gray-600
		marginTop: 16, // mt-4
	},
	registerLink: {
		color: '#DC2626', // red-600
		fontWeight: '500', // font-medium
		// React Native no tiene un "a" tag, así que usamos Text y TouchableOpacity para simular el enlace
	}
});