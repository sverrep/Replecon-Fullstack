import React, { useState } from "react";
import HomeScreen from './frontEnd/homeScreen.js';
import SignUpScreen from './frontEnd/signUpScreen.js';
import ProfileScreen from './frontEnd/profileScreen.js';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
  <NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen
        name = "Home"
        component={HomeScreen}
        options={{headerShown: false}}
    />
    <Stack.Screen
        name="Profile"
        component={ProfileScreen}
    />
    <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{headerShown: false}}
    />
       </Stack.Navigator>
      </NavigationContainer>
  );
  }



