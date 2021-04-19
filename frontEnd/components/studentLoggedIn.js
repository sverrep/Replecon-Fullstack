import 'react-native-gesture-handler';
import React from "react";
import ProfileScreen from './profileScreen.js';
import BankScreen from './bankScreen.js';
import StoreScreen from './storeScreen.js';
import ClassroomScreen from './classroomScreen.js';
import StatsScreen from './statsScreen.js';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

export default StudentLoggedIn = ({ navigation, route }) => {
    return (
        <Tab.Navigator
            initialRouteName="Profile"
            activeColor="#f0edf6"
            inactiveColor= "#226557"
            barStyle={{ backgroundColor: "#3BAD87" }}
        >
          <Tab.Screen
           name="Profile"
           component={ProfileScreen}
           options ={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ tintColor }) => (
                <MaterialCommunityIcons name="account" color={tintColor} size={25}/>
             ),
           }}
            />
          <Tab.Screen
          name="Store"
          component={StoreScreen}
          options ={{
              tabBarLabel: 'Store',
              tabBarIcon: ({ tintColor }) => (
                  <MaterialCommunityIcons name="cart" color={tintColor} size={25}/>
               ),
             }}
          />
          <Tab.Screen
          name="Bank"
          component={BankScreen}
          options ={{
              tabBarLabel: 'Bank',
              tabBarIcon: ({ tintColor }) => (
                  <MaterialCommunityIcons name="bank" color={tintColor} size={25}/>
               ),
             }}
          />
          <Tab.Screen
          name="Classroom"
          component={ClassroomScreen}
          options ={{
              tabBarLabel: 'Classroom',
              tabBarIcon: ({ tintColor }) => (
                  <MaterialCommunityIcons name="school" color={tintColor} size={25}/>
               ),
             }}
          />
          <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options ={{
              tabBarLabel: 'Stats',
              tabBarIcon: ({ tintColor }) => (
                  <MaterialCommunityIcons name="chart-pie" color={tintColor} size={25}/>
               ),
             }}
          />
        </Tab.Navigator>
      );
};