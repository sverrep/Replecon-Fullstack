import 'react-native-gesture-handler';
import React, { Component } from "react";
import {Text, View, FlatList, Modal} from "react-native";
import styles from '../componentStyles.js'
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements'
import { Button, Card, IconButton, TextInput } from 'react-native-paper';
import axios from 'axios';

class BankScreen extends Component {
  
  state={
    interest_rate: '',
    payout_rate: '',
    students: [],
    banks: [],
    class_code: '',
    loggedin_student: {},
    savings: [],
    amount: '',
    showSaving: false,
    showClaiming: false,
    selected_savings: {},

  }

  onAmountChange(text){
    this.setState({ amount: text });
  }

  getClassCode(){
    axios.get(getIP()+'/students/class_code/')
    .then(response => {
      this.setState({ students: response.data });
      this.setState({ class_code: this.state.students[0].class_code })
      axios.get(getIP()+'/students/current/')
      .then(response => {
        this.setState({loggedin_student: response.data}, () => {this.getStudentSavings()})
      })
      this.getBanks()
    })
    .catch(error => console.log(error))
  }

  getBanks(){
    axios.get(getIP()+'/banks/')
    .then(response => {
      this.setState({banks: response.data})
      this.getBankDetails(response.data)
    })
    .catch(error => console.log(error))
  }

  getBankDetails(banks){
    for (let i = 0; i<=Object.keys(banks).length -1;i++)
    {
      if(banks[i].classroom==this.state.class_code)
      {
        this.setState({interest_rate:banks[i].interest_rate})
        this.setState({payout_rate:banks[i].payout_rate})
      }
    }
  }

  claimSavings(){
    console.log(this.state.selected_savings)
    if(this.state.selected_savings.payout_date == 0)
    {
      axios.post(getIP()+'/transactions/banksavings/', {"amount": this.state.selected_savings.final_amount, "done": true})
      .then(response => {
        console.log(response.data)
        axios.put(getIP()+'/transactioninterestrates/', {active: false, class_code: this.state.class_code, transaction_id: this.state.selected_savings.transaction_id})
        .then(response => {
          console.log(response.data)
          axios.get(getIP()+'/students/bank/')
          .then(response => {
            console.log(response.data)
            axios.put(getIP()+'/students/balance/', { amount: this.state.selected_savings.final_amount, user_id: response.data, recipient: true })
            .then(response => {
              console.log(response.data)
              this.setState({showSaving:false})
              this.getStudentSavings()
            })
            .catch(error => console.log(error))
          })
          .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
    }
  }

  renderData = (item) => {
    if(item.active == true)
    {
      return(
        <View>
          <Card style={styles.studentCards} onPress={() => {this.clickedClaimingPopUp(item)}}>
              <Text style={styles.subHeader}> ${item.initial_amount}  {'-->'}  {item.interest_rate}%  {'-->'}  ${item.final_amount}</Text>
              <Text>Claimable in: {item.payout_date} days</Text>
          </Card>
        </View>
      )
    }
    
  }

  getStudentSavings(){
    this.setState({savings: []})
    axios.get(getIP()+'/transactioninterestrates/')
    .then(response1 => {
        for(let i = 0; i <= Object.keys(response1.data).length-1; i++)
        {
            axios.get(getIP()+'/transactions/' + response1.data[i].transaction_id)
            .then(response2 => {
                var initamount = parseFloat(response2.data.amount)
                if(this.state.loggedin_student.id == response2.data.sender_id)
                {
                    var intrate = parseFloat(response1.data[i].set_interest_rate)
                    var finalamount = initamount + (initamount*(intrate/100))
                    axios.get(getIP()+'/transactioninterestrates/payoutdate/' + response2.data.id)
                    .then(response => {
                      var payout_date = (((response.data / 60) / 60) / 24)
                      var tempdict = {
                        "id": i, 
                        "initial_amount": initamount, 
                        "interest_rate": intrate, 
                        "final_amount": finalamount, 
                        "transaction_id": response2.data.id, 
                        "payout_date": payout_date, 
                        "active": response1.data[i].active
                      }
                      this.setState({savings: [...this.state.savings, tempdict]})
                    })
                    .catch(error => console.log(error))
                }
            })
            .catch(error => console.log(error))
        }
    })
    .catch(error => console.log(error))
  }

  clickedSavingsPopUp(){
    this.setState({showSaving:true})
  }

  clickedClaimingPopUp(item){
    this.setState({showClaiming: true})
    this.setState({selected_savings: item })
  }

  setStudentSavings(){
    axios.post(getIP()+'/transactions/banksavings/', {"amount": this.state.amount, "done": false})
    .then(response => {
      var transaction_id = response.data["id"]
      axios.post(getIP()+'/transactioninterestrates/', {"class_code": this.state.class_code, "transaction_id": transaction_id})
      .then(response => {
        axios.get(getIP()+'/students/bank/')
        .then(response => {
          axios.put(getIP()+'/students/balance/', { amount: this.state.amount, user_id: response.data })
          .then(response => {
            this.setState({showSaving:false})
            this.getStudentSavings()
          })
          .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
  }

  renderSavingsPopUp(){
    return(
      <Modal
          transparent = {true}
          visible = {this.state.showSaving}
      >
          <View style = {{backgroundColor:'#000000aa', flex:1}}>
          <View style = {{backgroundColor:'#ffffff', margin:50, padding:40, borderRadius:10, marginTop:200, bottom: 50, flex:1}} >
            <View style = {{position: 'absolute', right:0, top:0}}>
              <IconButton
                icon="close-box-outline"
                color= 'grey'
                size={20}
                onPress={() => {this.setState({showSaving:false})}}
              />
            </View>
            <Text>Duration {this.state.payout_rate} Week</Text>
            <Text>Interest rate of {this.state.interest_rate}%</Text>
            <TextInput
              label="Amount"
              mode = 'outlined'
              onChangeText={this.onAmountChange.bind(this)}
            />
            <Button onPress={() => {this.setStudentSavings()}}>Insert Savings {this.state.selected_name}</Button>
          </View>
        </View>
      </Modal>
    )
  }

  renderClaimingPopUp(){
    return(
      <Modal
          transparent = {true}
          visible = {this.state.showClaiming}
      >
          <View style = {{backgroundColor:'#000000aa', flex:1}}>
          <View style = {{backgroundColor:'#ffffff', margin:40, padding:40, borderRadius:10, marginTop:300, bottom: 0}} >
            <View style = {{position: 'absolute', right:0, top:0}}>
              <IconButton
                icon="close-box-outline"
                color= 'grey'
                size={20}
                onPress={() => {this.setState({showClaiming:false})}}
              />
            </View>
            <Button onPress={() => {this.claimSavings()}}>Claim Savings</Button>
          </View>
        </View>
      </Modal>
    )
  }
  
  componentDidMount(){
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getClassCode()
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
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

          <Text style = {styles.subHeader}> Current Intrest Rate: {this.state.interest_rate}%</Text>
          
        </View>
        
        <View style={{flex: 7}}>
          <Text style={styles.header}>My Savings</Text>
          <FlatList
            data = {this.state.savings}
            renderItem = {({item})=> {
            return this.renderData(item)
            }}
            keyExtractor = {item => item.id.toString()}
          />
        </View>

        <View style={{flex: 1}}>
          <Button
          onPress = {() =>{this.clickedSavingsPopUp()}}
          mode = 'contained'
          >Start Saving</Button>
        </View>
        
        {this.renderSavingsPopUp()}
        {this.renderClaimingPopUp()}
      </View>
      
    )
  }
}

export default function(props) {
  const navigation = useNavigation();

  return <BankScreen {...props} navigation={navigation} />;
}