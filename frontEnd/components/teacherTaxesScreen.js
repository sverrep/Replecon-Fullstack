import 'react-native-gesture-handler';
import React, { Component } from "react";
import { View, Text, FlatList, Modal } from "react-native";
import { Button, Card, RadioButton, IconButton, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from '../componentStyles.js'
import axios from 'axios';



class TeacherTaxScreen extends Component {


state = {
    class_code: '',
    class_name: '',
    hasTaxesSetUp: false,
    class_tax: {},
    checked: '',
    current_tax_type: '',
    current_value: '',
    showSimpleModal: false
}

getTaxes(){
    axios.get(getIP()+'/taxes/')
        .then(response => {
            console.log(response.data)
            this.checkForClassTax(response.data)
        })
        .catch(error => console.log(error))
}

checkForClassTax(alltaxes){

 for(let i = 0; i <= Object.keys(alltaxes).length -1; i++){
    if(alltaxes[i].class_code == this.state.class_code){
        this.setState({hasTaxesSetUp: true})
        this.setState({class_tax:alltaxes[i]})
     }
 }
}

componentDidMount(){
    const {route} = this.props
    const {class_code, class_name} = route.params;
    this.setState({class_code:class_code})
    this.setState({class_name:class_name})
    this.getTaxes()
}

clickedItem(tax_type){
    this.setState({showSimpleModal:true})
    this.setState({current_tax_type:tax_type})
    if(tax_type == 'Flat Tax'){
        this.setState({current_value:this.state.class_tax.flat_tax})
    }
    else if(tax_type == 'Percentage Tax'){
        this.setState({current_value:this.state.class_tax.percentage_tax})
    }
}
renderSimpleModal(){
    return(
        <Modal
                    transparent = {true}
                    visible = {this.state.showSimpleModal}
                >
                    <View style = {{backgroundColor:'#000000aa', flex:1}}>
                        <View style = {{backgroundColor:'#ffffff', margin:20, padding:50, borderRadius:10, marginTop:200, bottom: 100, flex:1}} >
                            <View style = {{position: 'absolute', right:0, top:0}}>
                                <IconButton
                                icon="close-box-outline"
                                color= 'grey'
                                size={20}
                                onPress={() => {this.setState({showSimpleModal:false})}}
                                />
                            </View>
                            <Text>Editing the {this.state.current_tax_type}</Text>
                                    <View style={{flex:2, marginRight:5}}>
                                        <TextInput
                                        defaultValue= {this.state.current_value}
                                        label={this.state.current_tax_type}
                                        mode = 'outlined'
                                        //onChangeText={this.onUpdateItemNameChange.bind(this)}
                                        ></TextInput>
                                    </View>
                                <View>
                                    <Button 
                                    mode = 'contained'
                                    color = '#18E1FF'
                                    //onPress = {() => this.updateItem()}
                                    >Update</Button>
                                </View>
                        </View>
                    </View>
                </Modal>
    )

}

renderCards(){
    return(
    <View>
        <View style = {{flexDirection: 'row'}}>
            <View style ={{flex:1}}>
                <View style={{marginTop:10}}>
                    <RadioButton
                        color = "#006FFF"
                        status={ this.state.checked === 'first' ? 'checked' : 'unchecked' }
                        onPress = {() => this.setState({checked:'first'})}
                    />
                </View>
            </View>
            <View style= {{flex: 10}}> 
                <Card style={styles.studentCards} onPress = {() => this.clickedItem("Flat Tax")}>
                <Text>Flat Tax - {this.state.class_tax.flat_tax} $</Text>
                </Card>
            </View>
        </View>

        <View style = {{flexDirection: 'row'}}>
            <View style ={{flex:1}}>
                <View style={{marginTop:10}}>
                    <RadioButton
                        color = "#006FFF"
                        status={ this.state.checked === 'second' ? 'checked' : 'unchecked' }
                        onPress = {() => this.setState({checked:'second'})}
                    />
                </View>
            </View>
            <View style= {{flex: 10}}> 
                <Card style={styles.studentCards}  onPress = {() => this.clickedItem("Percentage Tax")}>
                    <Text>Percentage Tax - {this.state.class_tax.percentage_tax}%</Text>
                </Card>
            </View>
        </View>

        <View style = {{flexDirection: 'row'}}>
            <View style ={{flex:1}}>
                <View style={{marginTop:10}}>
                    <RadioButton
                        color = "#006FFF"
                        status={ this.state.checked === 'third' ? 'checked' : 'unchecked' }
                        onPress = {() => this.setState({checked:'third'})}
                    />
                </View>
            </View>
            <View style= {{flex: 10}}> 
                <Card style={styles.studentCards}>
                    <Text>Progressive Tax</Text>
                </Card>
            </View>
        </View>

        <View style = {{flexDirection: 'row'}}>
            <View style ={{flex:1}}>
                <View style={{marginTop:10}}>
                    <RadioButton
                        color = "#006FFF"
                        status={ this.state.checked === 'fourth' ? 'checked' : 'unchecked' }
                        onPress = {() => this.setState({checked:'fourth'})}
                    />
                </View>
            </View>
            <View style= {{flex: 10}}> 
                <Card style={styles.studentCards}>
                    <Text>Regressive Tax</Text>
                </Card>
            </View>
        </View>
    </View>
    )
}

renderTaxView(){
    if(this.state.hasTaxesSetUp){
        return (
            <View style={[styles.classroomContainer, {
                flexDirection: "column"
              }]}>
                <View style={{flex:1}}>
                    <Text style = {styles.header}>Tax Admin Panel - {this.state.class_name} </Text>
                </View>
                {this.renderSimpleModal()}
                <View style = {{flex:5}}>
                    {this.renderCards()}
                    <Button style ={{marginTop:15}}
                    mode = "contained"
                    >
                        Tax Class
                    </Button>
                </View>
            </View>
        ) 
    }

    else{
        return(
            <View style={[styles.classroomContainer, {
                flexDirection: "column"
              }]}>
                <View style={{flex:1}}>
                    <Text style = {styles.header}>Tax Set Up</Text>
                </View>

                <View style = {{flex:5}}>
                    <Text style= {styles.subHeader}>This class doesn't have taxes set up yet, start setting one up below. All of these fields can by changed in the future.</Text>
                    <Button
                    mode = 'contained'
                    >Save</Button>
                </View>
            </View>
        )
    }
}

render(){
    return(
        this.renderTaxView()
    )
}

}

export default function(props) {
    const navigation = useNavigation();
  
    return <TeacherTaxScreen {...props} navigation={navigation} />;
}