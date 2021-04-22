import React from "react";
import LoginScreen from './components/loginScreen.js';
import StudentSignUpScreen from './components/signUpScreen.js';
import StudentLoggedIn from './components/studentLoggedIn.js';
import TeacherSignUpScreen from './components/teacherSignUpScreen.js';
import TeacherLoggedIn from './components/teacherLoggedIn.js';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
  <NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen
        name = "Login"
        component={LoginScreen}
        options={{headerShown: false}}
    />
    <Stack.Screen
        name="Profile"
        component={StudentLoggedIn}
        options={{headerShown: false}}
    />
    <Stack.Screen
        name="StudentSignUp"
        component={StudentSignUpScreen}
        options={{headerShown: false}}
    />
    <Stack.Screen
        name="TeacherSignUp"
        component={TeacherSignUpScreen }
        options={{headerShown: false}}
    />
    <Stack.Screen
        name="TeacherProfile"
        component={TeacherLoggedIn }
        options={{headerShown: false}}
    />
       </Stack.Navigator>
      </NavigationContainer>
  );
  }



