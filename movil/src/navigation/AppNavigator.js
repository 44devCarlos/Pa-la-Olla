// src/navigation/AppNavigator.js

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/app/HomeScreen";
import Login from "../screens/Login";
import Register from "../screens/Register";

import Perfil from "../screens/Perfil";
import PasosAvanzados from "../screens/PasosAvanzados"; // Asegúrate de que esta ruta sea correcta

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          // Esta es la línea clave para ocultar el header por defecto
          options={{ headerShown: false }}
        />
        {/* Pantalla de Pasos Avanzados */}
        <Stack.Screen
          name="PasosAvanzados"
          component={PasosAvanzados}
          options={{ title: "Pasos Avanzados" }} // Título para la pantalla de Pasos Avanzados
        />
        <Stack.Screen
          name="Login"
          component={Login}
          // Ocultamos el header para usar uno personalizado si es necesario
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
          // Puedes decidir si mostrar el header por defecto o no
          options={{ title: "Mi Perfil" }} // Ejemplo: Mostrar un título
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
