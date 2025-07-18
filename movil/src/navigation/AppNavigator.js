// src/navigation/AppNavigator.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import HomeScreen from '../screens/app/HomeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="HomeScreen" 
          component={ HomeScreen} 
          // Esta es la línea clave para ocultar el header por defecto
          options={{ headerShown: false }} 
        />
        {/* Aquí podrías agregar otras pantallas como Login, Registro, etc. */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;