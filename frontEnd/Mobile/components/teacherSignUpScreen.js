import 'react-native-gesture-handler';
import React, { useState, Component } from "react";
import { View } from "react-native";
import LoginOrSignupForm from './classes/LoginOrSignupForm.js';

class TeacherSignUpScreen extends Component {
    render() {
        return (
          <View style={{ flex: 1 }}>
            <LoginOrSignupForm teachercreate />
          </View>
        );
      }
    };

export default TeacherSignUpScreen;
   
   
