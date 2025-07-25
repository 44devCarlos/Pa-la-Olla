// src/navigation/AppNavigator.js

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WhatsAppButton from '../components/WhatsAppButton';
import HomeScreen from "../screens/app/HomeScreen";
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";

import Perfil from "../screens/auth/Perfil";
import HistorialPedidos from "../screens/auth/HistorialPedidos";
import DetallePedido from "../screens/auth/DetallePedido";
import PasosAvanzados from "../screens/Recetas/PasosAvanzados";
import PasosFacil from "../screens/Recetas/PasosFacil";

import EditarPerfil from "../screens/auth/EditarPerfil";
//import Perfil from './src/screens/Perfil';
//import PasosFacil from './src/screens/PasosFacil';
//import PasosAvanzados from './src/screens/PasosAvanzados';
//import EditarPerfil from '../screens/EditarPerfil';
import Descripcion from '../screens/Recetas/Descripcion';
import OrdenarPedido from '../screens/Pedidos/OrdenarPedido';
import * as Linking from "expo-linking";


const Stack = createStackNavigator();

const linking = {
	prefixes: [Linking.createURL("/")],
	config: {
		screens: {
			HomeScreen: "homeScreen",
			Descripcion: "descripcion",
		},
	},
};

const AppNavigator = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        {/* Pantalla de Pasos Avanzados */}
        <Stack.Screen
          name="PasosAvanzados"
          component={PasosAvanzados}
          options={{ title: "Pasos Avanzados" }} 
        />

         <Stack.Screen
          name="PasosFacil"
          component={PasosFacil}
          options={{ title: "Pasos Facil" }} 
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        {/* Pantallas de Autenticación */}
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />

        {/* Pantalla de Perfil */}
        <Stack.Screen
          name="Perfil"
          component={Perfil}
          options={{ headerShown: false }} 
        />

        <Stack.Screen
          name="HistorialPedidos"
          component={HistorialPedidos}
          options={{ title: "Historial de Pedidos"}} 
        />

         <Stack.Screen
          name="DetallePedido"
          component={DetallePedido}
          options={{ title: "Detalles del Pedido" }} 
        />

        <Stack.Screen
          name="EditarPerfil"
          component={EditarPerfil}
          options={{ headerShown: false }} 
        />

        <Stack.Screen
          name="Descripcion"
          component={Descripcion}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="OrdenarPedido"
          component={OrdenarPedido}
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
