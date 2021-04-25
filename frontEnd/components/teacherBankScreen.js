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
        bank_id: "",
        classHasBank: false,
        showCreateBank: false,
        showUpdateBankRates:false,
        interest_rate: "",
        payout_rate: "",
        student_savings: [],

    }



    componentDidMount(){
        const {route} = this.props
        const class_code = route.params;
        this.setState({class_code:class_code})
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
            interest_rate: this.state.interest_rate,
            payout_rate: this.state.payout_rate,
        })
        .then(response => {
          console.log(response.data)
        })
        .catch(error => console.log(error))
    }

    renderData = (item) => {
        return(
          <View>
            <Card style={styles.studentCards}>
                <Text style={styles.subHeader}>{item.name}   {item.initial_amount}  {'-->'}  {item.interest_rate}  {'-->'}  {item.final_amount}</Text>
            </Card>
          </View>
        )
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
                                defaultValue= {this.state.interest_rate}
                                label="Interest Rate"
                                mode = 'outlined'
                                onChangeText={this.onInterestRateChange.bind(this)}
                                />
                            </View>
                        </View>
                        <View style={{marginTop:10}}>
                            <TextInput
                                defaultValue= {this.state.payout_rate}
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
                <Text>Bank</Text>
               // this.hasShop()
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
  