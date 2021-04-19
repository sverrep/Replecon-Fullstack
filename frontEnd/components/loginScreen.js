import 'react-native-gesture-handler';
import React, { Component } from "react";
import { View } from "react-native";
import LoginOrSignupForm from './classes/LoginOrSignupForm.js';

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
  
  
  
