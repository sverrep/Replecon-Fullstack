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
} from "react-native";
import styles from '../componentStyles.js'

export default HomeScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.image} source={require("../assets/apple.jpg")} />

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