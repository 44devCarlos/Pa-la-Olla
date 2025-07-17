import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
//import Perfil from './src/screens/Perfil';
import PasosFacil from './src/screens/PasosFacil';
//import PasosAvanzados from './src/screens/PasosAvanzados';

export default function App() {
	return (
		<>
      		<PasosFacil/>
     		<StatusBar style="auto" />
    	</>

		//<View style={styles.container}>
			     //<Text style={styles.texto}>Pa la olla</Text>
			     //<StatusBar style="auto" />
		//</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	texto: {
		fontSize: 50,
		fontWeight: "bold",
		color: "#000",
	},
});
