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
import axios from 'axios';

class BankScreen extends Component {
  
  state={
    intrest_rate:'',
    students: [],
    banks: [],
    class_code:'',

  }

  getClassCode(){
    axios.get(getIP()+'/students/class_code/')
    .then(response => {
      this.setState({ students: response.data });
      this.setState({ class_code: this.state.students[0].class_code })
      this.getBanks()
    })
    .catch(error => console.log(error))
  }

  getBanks(){
    axios.get(getIP()+'/banks/')
    .then(response => {
      this.setState({banks: response.data})
      this.getIntrestRate(response.data)
    })
    .catch(error => console.log(error))
  }
  getIntrestRate(banks){
    for (let i = 0; i<=Object.keys(banks).length -1;i++)
    {
      if(banks[i].classroom==this.state.class_code)
      {
        this.setState({intrest_rate:banks[i].current_intrest_rate})
      }
    }
  }
  
  componentDidMount(){
    this.getClassCode()
  }

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

          <Text style = {styles.subHeader}> Current Intrest Rate: {this.state.intrest_rate}%</Text>
          
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