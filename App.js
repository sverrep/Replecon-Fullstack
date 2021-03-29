import 'react-native-gesture-handler';
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  StatusBar
} from "react-native";
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


  const HomeScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.image} source={require("./assets/apple.jpg")} />

        <SafeAreaView style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            placeholderTextColor="#000000"
            onChangeText={(email) => setEmail(email)}
          />
        </SafeAreaView>

        <SafeAreaView style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#000000"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </SafeAreaView>

        <TouchableOpacity>
          <Text style={styles.forgot_button}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Profile', { name: email })}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUp_button}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

    const SignUpScreen = ({ navigation, route }) => {
        const [name, setName] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [classCode, setClassCode] = useState("");
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.header}> Sign Up </Text>
                <SafeAreaView style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Full Name"
                        placeholderTextColor="#000000"
                        onChangeText={(name) => setName(name)}
                      />
                </SafeAreaView>

                <SafeAreaView style={styles.inputView}>

                    <TextInput
                        style={styles.TextInput}
                        placeholder="Email"
                        placeholderTextColor="#000000"
                        onChangeText={(email) => setEmail(email)}
                    />
                </SafeAreaView>

                <SafeAreaView style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Password"
                        placeholderTextColor="#000000"
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                    />
                </SafeAreaView>

                <SafeAreaView style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Class Code"
                        placeholderTextColor="#000000"
                        onChangeText={(classCode) => setClassCode(classCode)}
                    />
                </SafeAreaView>

                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.SignUp_button}>Already have an account? Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Profile', { name: name })}>
                    <Text style={styles.loginText}>Sign Up</Text>
                </TouchableOpacity>

        </SafeAreaView>
        )
      };

    const ProfileScreen = ({ navigation, route }) => {
        return <Text>This is {route.params.name}'s profile</Text>;
    };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginBottom: 40,
  },

  header: {
    marginBottom: 30,
    fontSize: 20,
    fontWeight: "bold",
  },

  inputView: {
    backgroundColor: "#C0C0C0",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    textAlign: "center",
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
  },

  signUp_button: {
      height: 30,
      marginTop: 10,
    },

  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#2196F3",
  },
});