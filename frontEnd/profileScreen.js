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
import styles from '../componentStyles.js'
import { NavigationContainer } from '@react-navigation/native';

export default ProfileScreen = ({ navigation, route }) => {
    return <Text>This is {route.params.name}'s profile</Text>;
};