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
  FlatList,
} from "react-native";
import styles from '../componentStyles.js';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { FAB, Card } from 'react-native-paper';


const mydata = [
  {id: 1, amount:'100', symbol:'+'},
  {id: 2, amount:'20', symbol:'-'},
  {id: 3, amount:'50', symbol:'+'},
  {id: 4, amount:'94', symbol:'-'},
  {id: 5, amount:'100', symbol:'+'},
  {id: 6, amount:'20', symbol:'-'},
  {id: 7, amount:'50', symbol:'+'},
  {id: 8, amount:'94', symbol:'-'},
  {id: 9, amount:'100', symbol:'+'},
  {id: 10, amount:'20', symbol:'-'},
  {id: 11, amount:'50', symbol:'+'},
  {id: 12, amount:'94', symbol:'-'},
]

const getTheme = (item) => {
  if (item.symbol == '+')
    return('green')
  else if (item.symbol == '-')
    return('red')

}

const renderData = (item) => {
  const color = getTheme(item)
  return(
    
    <Card style = {styles.cardStyle}>
    
    <Text style={{ textAlign: "left" }}> Details</Text>
    <Text style={{ textAlign: "right", color: color }}>{item.symbol} {item.amount}</Text>
    </Card>
  )

}

const currency = 'Cook Dollars'

class ProfileScreen extends Component {
  handleRequest() {
    // This request will only succeed if the Authorization header
    // contains the API token
    axios.get('http://192.168.1.58:8000/auth/logout/')
      .then(response => {
        axios.defaults.headers.common.Authorization = null
        this.props.navigation.navigate('Login');
      })
      .catch(error =>  console.log(error));
  }
  
  render() {
    return (
      <View style={[styles.profileContainer, {
        flexDirection: "column"
      }]}>
      <View style={{ flex: 1 }}>
        <FAB
          style = {styles.fab}
          small = {true}
          icon = 'logout-variant'

          onPress={this.handleRequest.bind(this)}
        />  
      </View>

      <View style={{ flex: 2 }}>
        <Text style = {styles.header}>Balance</Text>
        <Text style = {styles.balanceAmount}>206.99 {currency}</Text>
      </View>
      
      <View style={{ flex: 7 }}>
        <Text style = {styles.header}>History</Text>
        <FlatList
          data = {mydata}
          renderItem = {({item})=> {
            return renderData(item)
          }}
          keyExtractor = {item => item.id}
        />
      </View>
    
    </View>
    );
  }
}

export default function(props) {
  const navigation = useNavigation();

  return <ProfileScreen {...props} navigation={navigation} />;
}