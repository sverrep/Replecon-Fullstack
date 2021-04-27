import 'react-native-gesture-handler';
import React, { Component } from "react";
import { View, Text, FlatList, Modal } from "react-native";
import { Button, Card, IconButton, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from '../componentStyles.js'
import axios from 'axios';

class TeacherClassScreen extends Component {
    
    state = {
        students: [],
        class_code: '',
        teacher_id: "",
        show: false,
        amount: "",
        selected_name: "",
        selected_balance: "",
        selected_id: "",
    }

    renderData = (item) =>{
        return(
            <View>
            <Card style={styles.studentCards} onPress = {() => this.studentCardClicked(item)}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View>
                    <Text>{item.name}</Text>
                    </View>
                    
                    <View>
                    <Text>{item.balance}</Text>
                    </View>
               
                </View>
            </Card>
            </View>
        )
    }

    studentCardClicked(student){
        this.setState({selected_name: student.name})
        this.setState({selected_balance: student.balance})
        this.setState({selected_id: student.id})
        this.setState({show:true})
    }

    onAmountChange(text) {
        this.setState({ amount: text });
      } 

    renderStudentClickedModal(){
        return(
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
                  <Text>Send/Charge Student: {this.state.selected_name}</Text>
                  <TextInput
                    label="Amount"
                    mode = 'outlined'
                    onChangeText={this.onAmountChange.bind(this)}
                  />
                  <Button onPress={() => {this.sendToStudent()}}>Send to {this.state.selected_name}</Button>
                  <Button onPress={() => {this.chargeFromStudent()}}>Charge from {this.state.selected_name}</Button>
                </View>
              </View>
            </Modal>
        )
    }

    sendToStudent(){
        var payload = { user_id: this.state.selected_id, amount: this.state.amount }; 
        axios.put(getIP()+'/students/balance/', payload)
        .then(response => {
            axios.post(getIP()+'/transactions/teacherPayStudents/', {"user_id": response.data.user, "amount": this.state.amount})
            .then(response => {
                for(let i = 0; i <= Object.keys(this.state.students).length-1; i++)
                {
                    if(this.state.students[i].id == this.state.selected_id)
                    {
                        var temparray = this.state.students
                        var newbal = parseFloat(this.state.students[i].balance) + parseFloat(this.state.amount)
                        var tempstudent = {"id": this.state.selected_id, "class_code": this.state.students[i].class_code, "name": this.state.selected_name, "balance": newbal}
                        temparray[i] = tempstudent
                        this.setState({students: temparray})
                    }
                }
            })
            .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
        this.setState({show:false})
    }

    chargeFromStudent(){
        this.setState({amount: "-" + this.state.amount}, () => {this.sendToStudent()})
        
    }

    renderButtons(){
        const teacher_pay_params = {"students": this.state.students, "class_name": this.state.class_name}
        const teacher_bank_params = {"students": this.state.students, "class_code": this.state.class_code}
        return(
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <View style = {{padding: 5, marginTop:10 }}>
                    <Button
                    mode = 'contained'
                    onPress = {() => this.props.navigation.navigate("TeacherPay", teacher_pay_params)}
                    >
                    Pay
                    </Button>
                    <View style={{marginTop:10}}>
                        <Button
                        mode = 'contained'
                        >
                        Taxes
                        </Button>
                    </View>
                </View>

                <View style = {{padding: 5, marginTop:10 }}>
                    <Button
                    mode = 'contained'
                    
                    onPress = {() => this.props.navigation.navigate('TeacherStore', this.state.class_code)}
                    >
                    Store
                    </Button>
                    <View style={{marginTop:10}}>
                        <Button 
                        mode = 'contained'
                        onPress = {() => this.props.navigation.navigate('TeacherBank', teacher_bank_params)}
                        >
                        Bank
                        </Button>
                    </View>
                </View>
            </View>
        )
    }

    renderFlatList(){
        return(
            <FlatList
                data = {this.state.students}
                renderItem = {({item}) => {
                    return this.renderData(item)
                }}
                keyExtractor = {item => item.id.toString()}
            />
        )
    }
    
    getClassStudents() {
        axios.get(getIP()+'/students')
        .then(response => {
          this.setState({students:response.data});
          this.getCurrentClassStudents(response.data)
        })
        .catch(error => console.log(error))
    }

    getCurrentClassStudents(students){
        var newAr = []
        for (let i = 0; i<=Object.keys(students).length -1;i++)
        {
            if(students[i].class_code==this.state.class_code)
            {
               newAr.push(students[i])
            }
        }
        this.setState({students:newAr})

    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.teacherClassSetup()
          });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    teacherClassSetup(){
        const {route} = this.props
        const{class_name, class_code, teacher_id} = route.params;
        this.setState({class_name:class_name})
        this.setState({class_code:class_code})
        this.setState({teacher_id:teacher_id})
        this.getClassStudents()
    }

    render() {
      
      return (
        <View style={[styles.classroomContainer, {
            flexDirection: "column"
          }]}>
            
            <View style={{flex:3}}>
                <Text style={styles.header}>Class: {this.state.class_name}</Text>
                {this.renderFlatList()}
            </View>

            <View style={{flex:1}}>
                {this.renderButtons()}
            </View>

            <View>
                {this.renderStudentClickedModal()}
            </View>
            
        </View>
      );
    }
  }
  
  export default function(props) {
    const navigation = useNavigation();
  
    return <TeacherClassScreen {...props} navigation={navigation} />;
  }
  