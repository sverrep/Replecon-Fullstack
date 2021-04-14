import 'react-native-gesture-handler';
import React, { Component } from "react";
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
import styles from '../componentStyles.js';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


class ProfileScreen extends Component {
  handleRequest() {
    // This request will only succeed if the Authorization header
    // contains the API token
    axios.get('http://192.168.0.6:8000/auth/logout/')
      .then(response => {
        axios.defaults.headers.common.Authorization = null
        this.props.navigation.navigate('Login');
      })
      .catch(error =>  console.log(error));
  }
  
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Button title="Logout" onPress={this.handleRequest.bind(this)}/>
      </View>
    );
  }
}

export default function(props) {
  const navigation = useNavigation();

  return <ProfileScreen {...props} navigation={navigation} />;
}