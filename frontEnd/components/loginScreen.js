import 'react-native-gesture-handler';
import React, { useState, Component } from "react";
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
import LoginOrSignupForm from './classes/LoginOrSignupForm.js';
import styles from '../componentStyles.js'

class LoginScreen extends Component {
    render() {
      return (
        <View style={{ flex: 1 }}>
          <LoginOrSignupForm />
        </View>
      );
    }
  }

  export default LoginScreen;
  
  
  
