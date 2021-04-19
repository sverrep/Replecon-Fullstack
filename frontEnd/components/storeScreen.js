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
  StatusBar
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import styles from '../componentStyles.js'
import { NavigationContainer } from '@react-navigation/native';

class StoreScreen extends Component {
  render(){
    return(
      <Text>This is the store screem</Text>
    )
  }
}

export default function(props) {
  const navigation = useNavigation();

  return <StoreScreen {...props} navigation={navigation} />;
}