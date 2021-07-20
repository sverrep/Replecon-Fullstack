import 'react-native-gesture-handler';
import React, { useState, Component } from "react";
import { View } from "react-native";
import LoginOrSignupForm from './classes/LoginOrSignupForm.js';

class StudentSignupScreen extends Component {
    render() {
        return (
          <View style={{ flex: 1 }}>
            <LoginOrSignupForm studentcreate />
          </View>
        );
      }
    };

export default StudentSignupScreen;
   
   
