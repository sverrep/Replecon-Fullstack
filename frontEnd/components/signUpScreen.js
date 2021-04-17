import 'react-native-gesture-handler';
import React, { useState, Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import LoginOrSignupForm from './classes/LoginOrSignupForm.js';

class SignupScreen extends Component {
    render() {
        return (
          <View style={{ flex: 1 }}>
            <LoginOrSignupForm create />
          </View>
        );
      }
    };

export default SignupScreen;
   
   
