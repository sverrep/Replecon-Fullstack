import 'react-native-gesture-handler';
import React, { Component } from "react";
import { View, Text, FlatList, Modal, ScrollView } from "react-native";
import { Button, Card, RadioButton, IconButton, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from '../componentStyles.js'
import axios from 'axios';
import TeacherSignUpScreen from './teacherSignUpScreen.js';
import { ThemeConsumer } from 'react-native-elements';

class TeacherUpdateProgScreen extends Component {

state = {
    tax_id :'',
    brackets: [],
    progAmount: 0,

    arOfHigh: [],
    arOfLow: [],
    arOfPer:[],
    arOfId:[],

    showError: false,
    errorMessage: '',


}

deleteBracket(){
    axios.delete(getIP()+'/progressivebrackets/'+ this.state.arOfId[this.state.progAmount-1])
        .then(response => {
          console.log(response.data)
        })
        .catch(error => console.log(error))
}

createBracket(){
    axios.post(getIP()+'/progressivebrackets/',{
        tax_id: this.state.tax_id,
        lower_bracket: 0.0,
        higher_bracket: 0.0,
        percentage: 0.0,
    })
    .then(response => {
        this.state.arOfId.push(response.data.id)
        this.state.arOfHigh.push(response.data.higher_bracket)
        this.state.arOfLow.push(response.data.lower_bracket)
        this.state.arOfPer.push(response.data.percentage)
    })
    .catch(error => console.log(error))

    
}

onUpdateLowChange(text, i){
        var tempAr = this.state.arOfLow
        tempAr[i] = text
        this.setState({arOfLow:tempAr})
}

onUpdateHighChange(text, i){
    var tempAr = this.state.arOfHigh
    tempAr[i] = text
    this.setState({arOfHigh:tempAr})
}

onUpdatePerChange(text, i){
    var tempAr = this.state.arOfPer
    tempAr[i] = text
    this.setState({arOfPer:tempAr})
}

arraySetUp(ar){
    for(let i =0; i <= Object.keys(ar).length -1;i++){
        var tempHighAr = this.state.arOfHigh
        tempHighAr[i] = ar[i].higher_bracket
        this.setState({arOfHigh:tempHighAr})

        var tempLowAr = this.state.arOfLow
        tempLowAr[i] = ar[i].lower_bracket
        this.setState({arOfLow:tempLowAr})

        var tempPerAr = this.state.arOfPer
        tempPerAr = ar[i].percentage
        this.setState({arOfPer: [...this.state.arOfPer, tempPerAr]})

        var tempIdAr = this.state.arOfId
        tempIdAr[i] = ar[i].id
        this.setState({arOfId:tempIdAr})
        console.log(ar[i].id)
        
    }
}
componentDidMount(){
    const {route} = this.props
    const tax_id = route.params;
    this.setState({tax_id:tax_id})
    this.getAllBrackets()
    
    
}
getAllBrackets(){
    axios.get(getIP()+'/progressivebrackets/')
    .then(response => {
        this.getClassProgressiveBrackets(response.data)
    })
    .catch(error => console.log(error))  
}

getClassProgressiveBrackets(brackets){
    var tempar = []
    for(let i = 0; i<=Object.keys(brackets).length -1; i++){
        if(brackets[i].tax_id==this.state.tax_id){
            tempar.push(brackets[i])
        }
    }
    this.arraySetUp(tempar)
    this.setState({brackets:tempar})
    this.setState({progAmount:tempar.length})
}

defaultLowValue(i){
    return this.state.arOfLow[i]
}

defaultHighValue(i){
    return this.state.arOfHigh[i]
}

defaultPerValue(i){
    return this.state.arOfPer[i]
}

renderProgBracket(i){
    return(
        <View>
            <View style ={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style = {{flex:2}}>
                    <TextInput style = {{padding :10}}
                        defaultValue = {this.defaultLowValue(i)}
                        label="Low"
                        mode = 'outlined'
                        onChangeText={(val) => this.onUpdateLowChange(val, i)}
                    ></TextInput>
                </View>

                <View style = {{flex: 2}}>
                    <TextInput style = {{padding :10}}
                        defaultValue = {this.defaultHighValue(i)}
                        label="High"
                        mode = 'outlined'
                        onChangeText={(val) => this.onUpdateHighChange(val, i)}
                    ></TextInput>
                </View>

                <View style = {{flex: 2}}>
                    <TextInput style = {{padding:10}}
                        defaultValue = {this.defaultPerValue(i)}
                        label= "%"
                        mode = 'outlined'
                        onChangeText={(val) => this.onUpdatePerChange(val, i)}
                    ></TextInput>
                </View>         
            </View>
        </View>
    )
}

renderTextInputs(){
    var ar = []
    for (let i = 0; i<=this.state.progAmount-1; i++){
        ar.push(this.renderProgBracket(i))
    }
    return ar
}

BracketClicked(text){
    if( text == 'plus'){
        this.setState({progAmount: this.state.progAmount+1})
        this.createBracket()
    }
    else if(text == 'minus'){
        this.setState({progAmount: this.state.progAmount-1})
        this.deleteBracket()
        this.state.arOfHigh.pop()
        this.state.arOfLow.pop()
        this.state.arOfPer.pop()
        this.state.arOfId.pop()
    }
    
    
}

renderButtons(){
    return(
    <View style ={{flexDirection:'row'}}>
                            
        <View>
            <IconButton
                icon="minus"
                color= 'grey'
                size={20}
                onPress={() => this.BracketClicked('minus')}
                />
        </View>

        <View>
            <IconButton
                icon="plus"
                color= 'grey'
                size={20}
                onPress={() => this.BracketClicked('plus')}
            />
        </View>
    </View>
    )
}

displayErrorMessage(){
    return (this.state.showError && <Text style={{color: "red"}}>{this.state.errorMessage}</Text>)
}

checkIfNumValid(num){
    if(isNaN(num)){
        this.setState({errorMessage: 'Make sure to that brackets only include numbers', showError: true})
        return false
    }
    else{
        if(Math.sign(num) == 1){
            return true
        }
        else{
            this.setState({errorMessage: 'Make sure to that the brackets only contain positive numbers', showError: true})
            return false
        }
    }
}

progressive_taxes_isValid(){
    var status = true
    for(let i = 0; i <= Object.keys(this.state.arOfLow).length-1; i++ ){
        if (this.checkIfNumValid(this.state.arOfLow[i])){

        }
        else{
            status = false
        }

        if (this.checkIfNumValid(this.state.arOfHigh[i])){

        }
        else{
            status = false
        }

        if (this.checkIfNumValid(this.state.arOfPer[i])){

        }
        else{
            status = false
        }
    }
    return status
}

updateBrackets(){
    if(this.progressive_taxes_isValid()){
    for(let i = 0; i<= Object.keys(this.state.arOfId).length-1; i++){
        axios.put(getIP()+'/progressivebrackets/'+ this.state.arOfId[i], {
            tax_id: this.state.tax_id,
            lower_bracket: this.state.arOfLow[i],
            higher_bracket: this.state.arOfHigh[i],
            percentage: this.state.arOfPer[i], 
        })
        .then(response => {
            
        })
        .catch(error => console.log(error))  
    }
    }
}

renderUpdateButton(){
    return(
        <View  style = {{padding:10, marginTop: 20}}>
            <Button
            mode = 'contained'
            onPress = {() => this.updateBrackets()}
            >
                Update Brackets
            </Button>
        </View>
    )
}
render(){
    return(
        <View>
            <Text>Update Progressive {this.state.tax_id}</Text>
            {this.renderButtons()}
            {this.renderTextInputs()}
            {this.displayErrorMessage()}
            {this.renderUpdateButton()}
        </View>
        
    )
}
}


export default function(props) {
    const navigation = useNavigation();
    
    return <TeacherUpdateProgScreen {...props} navigation={navigation} />;
}