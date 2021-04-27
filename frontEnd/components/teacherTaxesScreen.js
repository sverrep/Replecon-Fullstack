import 'react-native-gesture-handler';
import React, { Component } from "react";
import { View, Text, FlatList, Modal, ScrollView } from "react-native";
import { Button, Card, RadioButton, IconButton, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from '../componentStyles.js'
import axios from 'axios';
import { ThemeConsumer } from 'react-native-elements';



class TeacherTaxScreen extends Component {


state = {
    class_code: '',
    class_name: '',
    hasTaxesSetUp: false,
    class_tax: {},
    checked: '',
    current_tax_type: '',
    current_value: '',
    showSimpleModal: false,

    students: [],

    newSimpleValue: '',
    progAmount: 0,
    regAmount: 0,

    current_low: '',
    current_high: '',
    current_per: '',

    arOfLows: [],
    arOfHighs: [],
    arOfPer: [],

    regArOfLows: [],
    regArOfHighs:[],
    regArOfPer:[],
    current_bracket: {},
    arOfBrackets: [],

    current_sales_tax:'',
    current_percent_tax:'',
    current_flat_tax: '',

    class_brackets:[],
    class_regressive_brackets:[],
}


onUpdateLowChange(text, i, type){
    if(type == 'prog'){
        var tempAr = this.state.arOfLows
        tempAr[i] = text
        this.setState({arOfLows:tempAr})
        this.setState({ current_low: text });
    }

    else if(type == 'reg'){
        var tempAr = this.state.regArOfLows
        tempAr[i] = text
        this.setState({regArOfLows:tempAr})
        this.setState({ current_low: text });
    }
    
}

onUpdateHighChange(text, i, type){
    if(type == 'prog'){
        var tempAr = this.state.arOfHighs
        tempAr[i] = text
        this.setState({arOfHighs:tempAr})
        this.setState({ current_high: text });
    }

    else if(type == 'reg'){
        var tempAr = this.state.regArOfHighs
        tempAr[i] = text
        this.setState({regArOfHighs:tempAr})
        this.setState({ current_high: text });
    }
}
onUpdatePerChange(text, i, type){
    if(type == 'prog'){
        var tempAr = this.state.arOfPer
        tempAr[i] = text
        this.setState({arOfPer:tempAr})
        this.setState({ current_per: text });
    }

    else if(type == 'reg'){
        var tempAr = this.state.regArOfPer
        tempAr[i] = text
        this.setState({regArOfPer:tempAr})
        this.setState({ current_per: text });
    }
    
}

onUpdateValueChange(text){
    this.setState({ newSimpleValue: text });
}

onUpdateFlatChange(text){
    this.setState({current_flat_tax:text})
}

onUpdatePercentChange(text){
    this.setState({current_percent_tax:text})
}
onUpdateSalesChange(text){
    this.setState({current_sales_tax:text})
}

getTaxes(){
    axios.get(getIP()+'/taxes/')
        .then(response => {
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
    const {class_code, class_name, class_student} = route.params;
    this.setState({class_code:class_code})
    this.setState({class_name:class_name})
    this.setState({students:class_student})
    this.getTaxes()

    this.getAllBrackets()
    this.getAllRegressiveBrackets()
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

checkTextInputs(){

}

progBracketClicked(text){
    if( text == 'plus'){
        this.setState({progAmount: this.state.progAmount+1})
    }
    else if(text == 'minus'){
        this.setState({progAmount: this.state.progAmount-1})
    }
    
    
}

regBracketClicked(text){
    if( text == 'plus'){
        this.setState({regAmount: this.state.regAmount+1})
    }
    else if(text == 'minus'){
        this.setState({regAmount: this.state.regAmount-1})
    }
    
    
}

updateEasyTax(tax_type){
    var payload = {}
    if(tax_type == 'Flat Tax'){
        payload = {
            class_code: this.state.class_tax.class_code,
            flat_tax: this.state.newSimpleValue,
            percentage_tax: this.state.class_tax.percentage_tax,
            sales_tax: this.state.class_tax.sales_tax,
            id: this.state.class_tax.id,
        }
        axios.put(getIP()+'/taxes/'+ this.state.class_tax.id, payload )
        .then(response => {
          
        })
        .catch(error => console.log(error))
        this.setState({class_tax: payload})
    }

    else if(tax_type == 'Percentage Tax'){
        payload = {
            class_code: this.state.class_tax.class_code,
            flat_tax: this.state.class_tax.flat_tax,
            percentage_tax: this.state.newSimpleValue,
            sales_tax: this.state.class_tax.sales_tax,
            id: this.state.class_tax.id,
        }
        axios.put(getIP()+'/taxes/'+ this.state.class_tax.id, payload )
        .then(response => {
            console.log(response.data)
        })
        .catch(error => console.log(error))
        this.setState({class_tax: payload})
    }
    this.setState({showSimpleModal:false})
    
    
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
                                        onChangeText={this.onUpdateValueChange.bind(this)}
                                        ></TextInput>
                                    </View>
                                <View>
                                    <Button 
                                    mode = 'contained'
                                    color = '#18E1FF'
                                    onPress = {() => this.updateEasyTax(this.state.current_tax_type)}
                                    >Update {this.state.current_tax_type}</Button>
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
                <Card style={styles.studentCards} onPress = {() => this.props.navigation.navigate('TeacherUpdateProg', this.state.class_tax.id)}>
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
                <Card style={styles.studentCards} onPress = {() => this.props.navigation.navigate('TeacherUpdateReg', this.state.class_tax.id)}>
                    <Text>Regressive Tax</Text>
                </Card>
            </View>
        </View>
    </View>
    )
}



renderProgBracket(i, type){
    return(
        <View>
            <View style ={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style = {{flex:2}}>
                    <TextInput style = {{padding :10}}
                        label="Low"
                        mode = 'outlined'
                        onChangeText={(val) => this.onUpdateLowChange(val, i, type)}
                    ></TextInput>
                </View>

                <View style = {{flex: 2}}>
                    <TextInput style = {{padding :10}}
                        label="High"
                        mode = 'outlined'
                        onChangeText={(val) => this.onUpdateHighChange(val, i, type)}
                    ></TextInput>
                </View>

                <View style = {{flex: 2}}>
                    <TextInput style = {{padding:10}}
                        label= "%"
                        mode = 'outlined'
                        onChangeText={(val) => this.onUpdatePerChange(val, i, type)}
                    ></TextInput>
                </View>         
            </View>
        </View>
    )
}

renderAmount(type){
    var ar = []
    if(type=='prog'){
        for (let i = 0; i<=this.state.progAmount-1; i++){
            ar.push(this.renderProgBracket(i, type))
        }
    }
    else if(type=='reg'){
        for (let i = 0; i<=this.state.regAmount-1; i++){
            ar.push(this.renderProgBracket(i, type))
        }
    }
    return ar
}

setUpTax(){
    axios.post(getIP()+'/taxes/', {
        class_code: this.state.class_code,
        sales_tax: this.state.current_sales_tax,
        percentage_tax: this.state.current_percent_tax,
        flat_tax: this.state.current_flat_tax,
    })
    .then(response => {
        for(let i=0; i<=this.state.progAmount-1;i++){
            axios.post(getIP()+'/progressivebrackets/', {
                tax_id: response.data.id,
                lower_bracket: this.state.arOfLows[i],
                higher_bracket: this.state.arOfHighs[i],
                percentage: this.state.arOfPer[i],
            })
            .then(response => {
                
            })
            .catch(error => console.log(error))  
        }
        for(let i=0; i<=this.state.regAmount-1;i++){
            axios.post(getIP()+'/regressivebrackets/', {
                tax_id: response.data.id,
                lower_bracket: this.state.regArOfLows[i],
                higher_bracket: this.state.regArOfHighs[i],
                percentage: this.state.regArOfPer[i],
            })
            .then(response => {
                
            })
            .catch(error => console.log(error))
        }
    })
    .catch(error => console.log(error))
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
        if(brackets[i].tax_id==this.state.class_tax.id){
            tempar.push(brackets[i])
        }
    }
    this.setState({class_brackets:tempar})
}

getProgressiveTaxAmount(balance){
    var tax = 0;
    for(let i = 0; i<=Object.keys(this.state.class_brackets).length-1;i++){
        var am = 0
        if(balance>=this.state.class_brackets[i].higher_bracket){
            am = (this.state.class_brackets[i].higher_bracket - this.state.class_brackets[i].lower_bracket) * (this.state.class_brackets[i].percentage/100)
        }

        else if(balance<=this.state.class_brackets[i].higher_bracket && balance>this.state.class_brackets[i].lower_bracket){
            am = (balance - this.state.class_brackets[i].lower_bracket) * (this.state.class_brackets[i].percentage/100)
        }
        tax = tax + am
        
    }
    return tax
}

getAllRegressiveBrackets(){
    axios.get(getIP()+'/regressivebrackets/')
    .then(response => {
        this.getClassRegressiveBrackets(response.data)
    })
    .catch(error => console.log(error))  
}

getClassRegressiveBrackets(brackets){
    var tempar = []
    for(let i = 0; i<=Object.keys(brackets).length -1; i++){
        if(brackets[i].tax_id==this.state.class_tax.id){
            tempar.push(brackets[i])
        }
    }
    this.setState({class_regressive_brackets:tempar})
}

getRegressiveTaxAmount(balance){
    var tax = 0;
    for(let i = 0; i<=Object.keys(this.state.class_regressive_brackets).length-1;i++){
        var am = 0
        if(balance>=this.state.class_regressive_brackets[i].higher_bracket){
            am = (this.state.class_regressive_brackets[i].higher_bracket - this.state.class_regressive_brackets[i].lower_bracket) * (this.state.class_regressive_brackets[i].percentage/100)
        }

        else if(balance<=this.state.class_regressive_brackets[i].higher_bracket && balance>this.state.class_regressive_brackets[i].lower_bracket){
            am = (balance - this.state.class_regressive_brackets[i].lower_bracket) * (this.state.class_regressive_brackets[i].percentage/100)
        }
        tax = tax + am
        
    }
    return tax
}

taxTheClass(){
    if(this.state.checked == 'first'){
        var selected = this.state.students
        for(let i = 0; i <= Object.keys(selected).length-1; i++)
        {
            var payload = { user_id: selected[i].id, amount: '-'+this.state.class_tax.flat_tax }; 
            axios.put(getIP()+'/students/balance/', payload)
            .then(response => {
                axios.post(getIP()+'/transactions/teacherPayStudents/', {"user_id": response.data.user, "amount": '-'+this.state.class_tax.flat_tax})
                .then(response => {
                })
                .catch(error => console.log(error))
            })
            .catch(error => console.log(error))
        }
    }

    else if(this.state.checked == 'second'){
        var selected = this.state.students
        for(let i = 0; i <= Object.keys(selected).length-1; i++)
        {
            var percentamount = (selected[i].balance * (this.state.class_tax.percentage_tax/100)).toFixed(2)
            var payload = { user_id: selected[i].id, amount: "-"+percentamount }; 
            axios.put(getIP()+'/students/balance/', payload)
            .then(response => {
                axios.post(getIP()+'/transactions/teacherPayStudents/', {"user_id": response.data.user, "amount": "-"+percentamount})
                .then(response => {
                })
                .catch(error => console.log(error))
            })
            .catch(error => console.log(error))
        }

    }

    else if(this.state.checked == 'third'){
        var selected = this.state.students
        for(let i = 0; i <= Object.keys(selected).length-1; i++)
        {   
            var prog_amount = (this.getProgressiveTaxAmount(selected[i].balance)).toFixed(2)
            if(prog_amount>0){
                var payload = { user_id: selected[i].id, amount: '-'+prog_amount }; 
                axios.put(getIP()+'/students/balance/', payload)
                .then(response => {
                    axios.post(getIP()+'/transactions/teacherPayStudents/', {"user_id": response.data.user, "amount": "-"+prog_amount})
                    .then(response => {
                    })
                    .catch(error => console.log(error))
                })
                .catch(error => console.log(error))
            }
            
        }

    }

    else if(this.state.checked == 'fourth'){
        var selected = this.state.students
        for(let i = 0; i <= Object.keys(selected).length-1; i++)
        {   
            var prog_amount = (this.getRegressiveTaxAmount(selected[i].balance)).toFixed(2)
            if(prog_amount>0){
                var payload = { user_id: selected[i].id, amount: '-'+prog_amount }; 
                axios.put(getIP()+'/students/balance/', payload)
                .then(response => {
                    axios.post(getIP()+'/transactions/teacherPayStudents/', {"user_id": response.data.user, "amount": "-"+prog_amount})
                    .then(response => {
                    })
                    .catch(error => console.log(error))
                })
                .catch(error => console.log(error))
            }
            
        }
    }
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
                    onPress={() => this.taxTheClass()}
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

                <View style = {{flex:10}}>
                    <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style = {{flex:1, padding: 10}}>
                            <TextInput
                                label="Flat Tax"
                                mode = 'outlined'
                                onChangeText={this.onUpdateFlatChange.bind(this)}
                            ></TextInput>
                        </View>

                        <View style = {{flex:1, padding: 10}}>
                            <TextInput
                                label="Percentage Tax"
                                mode = 'outlined'
                                onChangeText={this.onUpdatePercentChange.bind(this)}
                            ></TextInput>
                        </View>
                        <View style = {{flex:1, padding: 10}}>
                            <TextInput
                                label="Sales Tax"
                                mode = 'outlined'
                                onChangeText={this.onUpdateSalesChange.bind(this)}
                            ></TextInput>
                        </View>

                    </View>
                    
                    <View>
                    <View style ={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View>
                            <Text style = {styles.header, {padding: 10}}>Progressive Taxes</Text>
                        </View>
                        <View style ={{flexDirection:'row'}}>
                            
                            <View>
                            <IconButton
                                icon="minus"
                                color= 'grey'
                                size={20}
                                onPress={() => this.progBracketClicked('minus')}
                            />
                            </View>

                            <View>
                            <IconButton
                                icon="plus"
                                color= 'grey'
                                size={20}
                                onPress={() => this.progBracketClicked('plus')}
                            />
                            </View>
                        </View>
                    </View>
                    <View>
                    {this.renderAmount('prog')}
                    </View>
                    <View style ={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View>
                            <Text style = {styles.header, {padding: 10}}>Regressive Taxes</Text>
                        </View>
                        <View style ={{flexDirection:'row'}}>
                            
                            <View>
                            <IconButton
                                icon="minus"
                                color= 'grey'
                                size={20}
                                onPress={() => this.regBracketClicked('minus')}
                            />
                            </View>

                            <View>
                            <IconButton
                                icon="plus"
                                color= 'grey'
                                size={20}
                                onPress={() => this.regBracketClicked('plus')}
                            />
                            </View>
                        </View>
                    </View>

                    <View>
                    {this.renderAmount('reg')}
                    </View>
                    
                    </View>
                    
                    <Button style = {{marginTop:10}}
                    mode = 'contained'
                    onPress={() => {this.setUpTax()}}
                    >Set Up Taxes</Button>
                </View>
            </View>
        )
    }
}

render(){
    return(
        <ScrollView>
        {this.renderTaxView()}
        </ScrollView>
    )
}

}

export default function(props) {
    const navigation = useNavigation();

    return <TeacherTaxScreen {...props} navigation={navigation} />;
}