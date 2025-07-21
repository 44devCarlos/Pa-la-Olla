// src/navigation/AppNavigator.js

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/app/HomeScreen";
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";

import Perfil from "../screens/auth/Perfil";
import PasosAvanzados from "../screens/Recetas/PasosAvanzados";

import EditarPerfil from "../screens/auth/EditarPerfil";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
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
          name="EditarPerfil"
          component={EditarPerfil}
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
