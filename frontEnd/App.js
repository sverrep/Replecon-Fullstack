import React from "react";
import LoginScreen from './components/loginScreen.js';
import StudentSignUpScreen from './components/signUpScreen.js';
import StudentLoggedIn from './components/studentLoggedIn.js';
import TeacherSignUpScreen from './components/teacherSignUpScreen.js';
import TeacherLoggedIn from './components/teacherLoggedIn.js';
import TeacherClassScreen from './components/teacherClassScreen.js';
import TeacherPayScreen from './components/teacherPayScreen.js';
import TeacherStoreScreen from './components/teacherStoreScreen.js';
import TeacherBankScreen from './components/teacherBankScreen.js';
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

    <Stack.Screen
        name="TeacherClass"
        component={TeacherClassScreen}
        options={{headerShown: false}}
    />
    <Stack.Screen
        name="TeacherPay"
        component={TeacherPayScreen}
    />
    <Stack.Screen
        name="TeacherStore"
        component={TeacherStoreScreen}
        options={{headerShown: false}}
    />
    <Stack.Screen
        name="TeacherBank"
        component={TeacherBankScreen}
    />
       </Stack.Navigator>
      </NavigationContainer>
  );
  }



