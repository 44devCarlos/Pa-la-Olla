// src/navigation/AppNavigator.js

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from "expo-linking";

// --- Importación de tus pantallas existentes ---
import HomeScreen from "../screens/app/HomeScreen";
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import Perfil from "../screens/auth/Perfil";
import HistorialPedidos from "../screens/auth/HistorialPedidos";
import DetallePedido from "../screens/auth/DetallePedido";
import PasosAvanzados from "../screens/Recetas/PasosAvanzados";
import PasosFacil from "../screens/Recetas/PasosFacil";
import EditarPerfil from "../screens/auth/EditarPerfil";
import Descripcion from '../screens/Recetas/Descripcion';
import OrdenarPedido from '../screens/Pedidos/OrdenarPedido';

import { PoliticaScreen, TerminosScreen } from '../screens/legal/legal';


const Stack = createStackNavigator();

const linking = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      HomeScreen: "homeScreen",
      Descripcion: "descripcion",
      // Añadimos las nuevas rutas al linking
      PoliticaDePrivacidad: "politica-de-privacidad",
      TerminosYCondiciones: "terminos-y-condiciones",
    },
  },
};

const AppNavigator = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        {/* Tus pantallas existentes */}
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PasosAvanzados"
          component={PasosAvanzados}
          options={{ title: "Pasos Avanzados" }} 
        />
        <Stack.Screen
          name="PasosFacil"
          component={PasosFacil}
          options={{ title: "Pasos Fáciles" }} 
        />
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
        

        <Stack.Screen
          name="PoliticaDePrivacidad"
          component={PoliticaScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="TerminosYCondiciones"
          component={TerminosScreen}
          options={{ headerShown: false }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
