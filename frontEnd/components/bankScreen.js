import 'react-native-gesture-handler';
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import styles from '../componentStyles.js'
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements'
import { Button } from 'react-native-paper';

class BankScreen extends Component {
  render(){
    return(

      <View style={[styles.classroomContainer, {
        flexDirection: "column"
      }]}>
        <View style={{flex: 4, alignItems: 'center', marginTop: 35}}>
          <Text style={styles.header}>Bank Of America</Text>
          <Icon
          raised
          name='bank'
          type='font-awesome'
          color='navy'
          size = {50}
          />
          
        </View>
        
        <View style={{flex: 7}}>
          <Text style={styles.header}>My Savings</Text>
        </View>

        <View style={{flex: 1}}>
          <Button
          onPress = {() =>{console.log("pressed")}}
          mode = 'contained'
          >Start Saving</Button>
        </View>
        
      </View>
      
    )
  }
}

export default function(props) {
  const navigation = useNavigation();

  return <BankScreen {...props} navigation={navigation} />;
}