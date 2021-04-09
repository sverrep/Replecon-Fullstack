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
import styles from '../componentStyles.js';
import BankScreen from './bankScreen.js';
import StoreScreen from './storeScreen.js';
import ClassroomScreen from './classroomScreen.js';
import StatsScreen from './statsScreen.js';
import { createBottomTabNavigator, createAppContainer} from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';


export default ProfileScreen = ({ navigation, route }) => {
    return (
        <Text>This is profile screen</Text>
        );
};