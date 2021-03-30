import 'react-native-gesture-handler';
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import styles from '../componentStyles.js'
import { NavigationContainer } from '@react-navigation/native';

export default SignUpScreen = ({ navigation, route }) => {
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