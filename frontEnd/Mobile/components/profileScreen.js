import 'react-native-gesture-handler';
import React, { Component } from "react";
import { Text, View, FlatList, Modal} from "react-native";
import styles from '../componentStyles.js';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import getIP from './settings/settings.js';
import { FAB, Card, Button, IconButton } from 'react-native-paper';

class ProfileScreen extends Component {
  state = {
    balance: "",
    name: "",
    user_id: "",
    transactions:[],
    currency: 'Cook Dollars',
    show:false,
    bought_items:[],
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

  renderBoughtItems(item){
    return(
      <Card style={styles.cardStyle}>
        <Text style={{ textAlign: "left" }}> {item.item_name}</Text>
      </Card>
    )
  }

  clickedItem = (data) => {
    axios.get(getIP()+'/items/boughtitems/')
    .then(response => {
      this.setState({bought_items: response.data}, () => {
        this.setState({show:true})
      })
    })
    .catch(error => console.log(error))
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
        <Button onPress={() => {this.clickedItem()}}>Bought Items</Button>
        <Modal
          transparent = {true}
          visible = {this.state.show}
        >
          <View style = {{backgroundColor:'#000000aa', flex:1}}>
            <View style = {{backgroundColor:'#ffffff', margin:50, padding:40, borderRadius:10, marginTop:200, bottom: 50, flex:1}} >
              <View style = {{position: 'absolute', right:0, top:0}}>
                <IconButton
                  icon="close-box-outline"
                  color= 'grey'
                  size={20}
                  onPress={() => {this.setState({show:false})}}
                />
              </View>
              <Text>Owned Items:</Text>
              <FlatList
                data = {this.state.bought_items}
                renderItem = {({item})=> {
                  return this.renderBoughtItems(item)
                }}
                keyExtractor = {item => item.id.toString()}
              />
            </View>
          </View>
        </Modal>
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