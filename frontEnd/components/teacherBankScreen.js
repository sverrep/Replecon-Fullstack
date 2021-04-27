import 'react-native-gesture-handler';
import React, { Component } from "react";
import { View, Text, FlatList, Modal } from "react-native";
import { Button, Card, IconButton, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from '../componentStyles.js'
import axios from 'axios';

class TeacherBankScreen extends Component {
    
    state = {
        class_code: "",
        students: [],
        bank_id: "",
        classHasBank: false,
        showCreateBank: false,
        showUpdateBankRates:false,
        interest_rate: "",
        payout_rate: "",
        student_savings: [],
        banks: [],

    }



    componentDidMount(){
        const {route} = this.props
        const {students, class_code} = route.params;
        this.setState({class_code:class_code})
        this.setState({students:students})
        this.getBanks()
    }

    teacherClassSetup(){
        
    }

    onInterestRateChange(text){
        this.setState({ interest_rate: text });
    }

    onPayoutRateChange(text){
        this.setState({payout_rate: text})
    }

    createBankClicked(){
        this.setState({showCreateBank:true})
    }

    updateBankRatesClicked(){
        this.setState({showUpdateBankRates:true})
    }

    updateBankRates(){
        axios.put(getIP()+'/banks/' + this.state.bank_id, {
            classroom: this.state.class_code,
            interest_rate: this.state.interest_rate,
            payout_rate: this.state.payout_rate,
        })
        .then(response => {
          this.setState({showUpdateBankRates:false})
        })
        .catch(error => console.log(error))
    }

    renderData = (item) => {
        return(
          <View>
            <Card style={styles.studentCards}>
                <Text style={styles.subHeader}>{item.name}:   ${item.initial_amount}  {'-->'}  {item.interest_rate}%  {'-->'}  ${item.final_amount}</Text>
                <Text>Pays out in {item.payout_date} days</Text>
            </Card>
          </View>
        )
    }

    getBanks(){
        axios.get(getIP()+'/banks/')
        .then(response => {
          this.setState({banks: response.data})
          this.checkForBank(response.data)
        })
        .catch(error => console.log(error))
    }

    checkForBank(banks){
        for(let i = 0; i <= Object.keys(banks).length - 1; i++){
            if(banks[i].classroom == this.state.class_code){
                this.setState({classHasBank:true})
                this.setState({bank_id: banks[i].id})
                this.setState({interest_rate: banks[i].interest_rate})
                this.setState({payout_rate: banks[i].payout_rate})
            }
        }
        this.getStudentSavings()
    }

    getStudentSavings(){
        axios.get(getIP()+'/transactioninterestrates/')
        .then(response1 => {
            for(let i = 0; i <= Object.keys(response1.data).length-1; i++)
            {
                axios.get(getIP()+'/transactions/' + response1.data[i].transaction_id)
                .then(response2 => {
                    var initamount = parseFloat(response2.data.amount)
                    axios.get(getIP()+'/users/' + response2.data.sender_id)
                    .then(userresponse => {
                        var intrate = parseFloat(response1.data[i].set_interest_rate)
                        var finalamount = initamount + (initamount*(intrate/100))
                        axios.get(getIP()+'/transactioninterestrates/payoutdate/' + response2.data.id)
                        .then(response => {
                            var payout_date = (((response.data / 60) / 60) / 24)
                            var tempdict = {"id": i, "name": userresponse.data.first_name, "initial_amount": initamount, "interest_rate": intrate, "final_amount": finalamount, "payout_date": payout_date}
                            this.setState({student_savings: [...this.state.student_savings, tempdict]})
                        })
                        .catch(error => console.log(error))
                    })
                    .catch(error => console.log(error))
                })
                .catch(error => console.log(error))
            }
        })
        .catch(error => console.log(error))
      }

    renderUpdateBankRatesModal(){
        return(
            <Modal
            transparent = {true}
            visible = {this.state.showUpdateBankRates}
            >
                <View style = {{backgroundColor:'#000000aa', flex:1}}>
                    <View style = {{backgroundColor:'#ffffff', margin:20, padding:20, borderRadius:10, marginTop:100, bottom: 50, flex:1}} >
                        <View style = {{position: 'absolute', right:0, top:0}}>
                            <IconButton
                            icon="close-box-outline"
                            color= 'grey'
                            size={20}
                            onPress={() => {this.setState({showUpdateBankRates:false})}}
                            />
                        </View>
                        <Text>Bank Rates:</Text>
                        <View style={{flexDirection: 'row', marginTop:10}}>
                            <View style={{flex:2, marginRight:5}}>
                                <TextInput
                                defaultValue= {this.state.interest_rate.toString()}
                                label="Interest Rate"
                                mode = 'outlined'
                                onChangeText={this.onInterestRateChange.bind(this)}
                                />
                            </View>
                        </View>
                        <View style={{marginTop:10}}>
                            <TextInput
                                defaultValue= {this.state.payout_rate.toString()}
                                label="Payout Rate in Weeks"
                                mode = 'outlined'
                                onChangeText={this.onPayoutRateChange.bind(this)}
                            />
                        </View>
                        <View style = {{flexDirection: 'column', marginTop: 15}}>
                            <View>
                                <Button 
                                mode = 'contained'
                                color = '#18E1FF'
                                onPress = {() => this.updateBankRates()}
                                >Update</Button>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    hasBank(){
        return(
            <View style={[styles.classroomContainer, {
                flexDirection: "column"
              }]}>
                <View style={{flex:1}}>
                    <Text style = {styles.header}>Bank Admin Page</Text>
                    <View>
                        <Text style = {styles.subHeader}>Interest Rate: {this.state.interest_rate}</Text>
                        <Text style = {styles.subHeader}>Payout Rate in Weeks: {this.state.payout_rate}</Text>
                    </View>
                </View>
                <View style = {{flex:5}}>
                    <FlatList
                        data = {this.state.student_savings}
                        renderItem = {({item})=> {
                        return this.renderData(item)
                        }}
                        keyExtractor = {item => item.id.toString()}
                    />
                    <Button
                    mode = 'contained'
                    onPress = {() => this.updateBankRatesClicked()}
                    >Update Bank Rates</Button>
                </View>
                {this.renderUpdateBankRatesModal()}
            </View>
        )
    }

    createNewBank(){
        console.log(this.state.class_code, this.state.interest_rate, this.state.payout_rate)
        axios.post(getIP()+'/banks/', {
            classroom: this.state.class_code,
            interest_rate: this.state.interest_rate,
            payout_rate: this.state.payout_rate,
        })
        .then(response => {
          
        })
        .catch(error => console.log(error))
    }

    renderCreateBank(){
        return(
            <Modal
                transparent = {true}
                visible = {this.state.showCreateBank}
            >
                <View style = {{backgroundColor:'#000000aa', flex:1}}>
                    <View style = {{backgroundColor:'#ffffff', margin:20, padding:20, borderRadius:10, marginTop:100, bottom: 50, flex:1}} >
                        <View style = {{position: 'absolute', right:0, top:0}}>
                            <IconButton
                            icon="close-box-outline"
                            color= 'grey'
                            size={20}
                            onPress={() => {this.setState({showCreateBank:false})}}
                            />
                        </View>
                        <Text> Bank Creation:</Text>
                        <View style={{marginTop:10}}>
                            <TextInput
                                label="Bank Interest Rate"
                                mode = 'outlined'
                                onChangeText={this.onInterestRateChange.bind(this)}
                            ></TextInput>
                        </View>

                        <View style={{marginTop:10}}>
                            <TextInput
                                label="Bank Payout Rate"
                                mode = 'outlined'
                                onChangeText={this.onPayoutRateChange.bind(this)}
                            ></TextInput>
                        </View>
                        
                        <View style ={{marginTop:10}}>
                            <Button 
                            mode = 'contained'
                            color = '#0FBC1A'
                            onPress = {() => this.createNewBank()}
                            >Create Bank</Button>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    hasNoBank(){
        return(
            <View style={[styles.classroomContainer, {
                flexDirection: "column"
              }]}>
                <View style={{flex:1}}>
                    <Text style = {styles.header}>Bank Admin Page</Text>
                </View>

                <View style = {{flex:5}}>
                    <Text style= {styles.subHeader}>This class doesn't have a bank yet, start setting one up by creating a bank</Text>
                    <Button
                    mode = 'contained'
                    onPress = {() => this.createBankClicked()}
                    >Create a Bank</Button>
                </View>
                {this.renderCreateBank()}
            </View>
        )
    }

    renderBankView(){
        if(this.state.classHasBank == true)
        {
            return(
                this.hasBank()
            )
        }

        else{
            return(
                this.hasNoBank()
            )
        }
    }


    render() {
      
      return (
        this.renderBankView()
      );
    }
  }
  
  export default function(props) {
    const navigation = useNavigation();
  
    return <TeacherBankScreen {...props} navigation={navigation} />;
  }
  