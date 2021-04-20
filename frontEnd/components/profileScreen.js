import 'react-native-gesture-handler';
import React, { Component } from "react";
import { Text, View, FlatList, Alert} from "react-native";
import styles from '../componentStyles.js';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import getIP from './settings/settings.js';
import { FAB, Card } from 'react-native-paper';

class ProfileScreen extends Component {
  state = {
    balance: "",
    name: "",
    user_id: "",
    transactions:[],
    currency: 'Cook Dollars'
  }

  componentDidMount(){
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.profileSetup()
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }



  profileSetup(){
    this.getStudentBalance()
    this.getStudentName()
    this.getStudentTransactions()
  }
  
  handleRequest() {
    // This request will only succeed if the Authorization header
    // contains the API token
    axios.get(getIP()+'/auth/logout/')
      .then(response => {
        axios.defaults.headers.common.Authorization = null
        this.props.navigation.navigate('Login');
      })
      .catch(error =>  console.log(error));
  }

  getStudentBalance() {
    axios.get(getIP()+'/students/balance/')
    .then(response => {
      const balance = response.data
      this.setState({balance})
    })
    .catch(error =>  console.log(error));
  }

  getStudentName(){
    axios.get(getIP()+'/students/current/')
    .then(response => {
      this.setState({name: response.data.first_name})
      this.setState({user_id: response.data.id})
    })
    .catch(error => console.log(error))
  }

  getStudentTransactions(){
    axios.get(getIP()+'/transactions/getAllStudentTransactions/')
    .then(response =>{
      this.setState({transactions: response.data})
    })
    .catch(error => console.log(error))
  }

  getTheme = (item) => {
    if (item.symbol == '+')
      return('green')
    else if (item.symbol == '-')
      return('red')
  }

  renderData = (item) => {
    const color = this.getTheme(item)
    var details = ""
    if(color == "green")
    {
      details = "From " + item.name
    }
    else if(color == "red")
    {
      details = "To " + item.name
    }
    return(
      <Card style = {styles.cardStyle}>
        <Text style={{ textAlign: "left" }}> {details}</Text>
        <Text style={{ textAlign: "right", color: color }}>{item.symbol} {item.amount}</Text>
      </Card>
    )
  }

  render() {
    return (
      <View style={[styles.profileContainer, {
        flexDirection: "column"
      }]}>
      <View style={{ flex: 1 }}>
      <Text style={ {marginTop: 20, fontWeight: 'bold', fontSize: 20} }>Hello, {this.state.name}</Text>
        <FAB
          style = {styles.fab}
          small = {true}
          icon = 'logout-variant'

          onPress={this.handleRequest.bind(this)}
        />  
        
      </View>

      <View style={{ flex: 2 }}>
        <Text style = {styles.header}>Balance</Text>
        <Text style = {styles.balanceAmount}>{this.state.balance} {this.state.currency}</Text>
        
      </View>
      
      <View style={{ flex: 7 }}>
        <Text style = {styles.header}>History</Text>
        <FlatList
          data = {this.state.transactions}
          renderItem = {({item})=> {
            return this.renderData(item)
          }}
          keyExtractor = {item => item.id.toString()}
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