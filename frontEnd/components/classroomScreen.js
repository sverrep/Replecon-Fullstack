import 'react-native-gesture-handler';
import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  Modal,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import styles from '../componentStyles.js'
import { Button, Card, TextInput, IconButton } from 'react-native-paper';
import getIP from "./settings/settings.js";
import axios from 'axios';


class ClassroomScreen extends Component {
  
   state = {
    students: [],
    class_code: "",
    class_name: "",
    teacher: {},
    show:false,
    name:"",
    amount: "",
    recipient_id: '',
    sender_id: '',
  }

  clickedItem = (data) => {
    this.setState({show:true})
    this.setState({name:data.name})
  }

  renderData = (item) => {
    return(
      
      <Card style={styles.studentCards} onPress = {() => this.clickedItem(item)}>
        <Text style={{ textAlign: "left" }}> {item.name}</Text>
      </Card>
    )
  
  }

  getClassStudents() {
    axios.get(getIP()+'/students/class_code/')
    .then(response => {
      this.setState({ students: response.data });
      this.setState({ class_code: this.state.students[0].class_code })
      this.getClassroomDetails()
    })
    .catch(error => console.log(error))
  }

  getClassroomDetails(){
    axios.get(getIP()+'/classrooms/')
    .then(response => {
      this.findClassroom(response.data)

    })
    .catch(error => console.log(error))
  }

  findClassroom(classrooms){
    for (let i = 0; i <= Object.keys(classrooms).length-1; i++)
    {
      if (classrooms[i].class_code == this.state.class_code)
      {
        this.setState({ class_name: classrooms[i].class_name });
        axios.get(getIP()+'/teachers/')
        .then(response => {
          for(let j = 0; j <= Object.keys(response.data).length-1; j++)
          {
            if (response.data[j].id == classrooms[i].teacher_id)
            {
              this.setState({teacher: response.data[j]})
            }
          }
        })
        .catch(error => console.log(error))
      }
    }
  }

  componentDidMount(){
    this.getClassStudents()
  }

  onAmountChange(text) {
    this.setState({ amount: text });
  } 

  createTransaction(){
    for (let i = 0; i <= Object.keys(this.state.students).length-1; i++)
    {
      if (this.state.students[i].name == this.state.name)
      {
        this.setState({ recipient_id: this.state.students[i].id }, () => {
          axios.get(getIP()+'/students/current/')
          .then(response => {
            this.setState({sender_id: response.data.id}, () => {
              const payload = { user_id: this.state.recipient_id, amount: this.state.amount, recipient: false };
              const transaction_payload = { recipient_id: this.state.recipient_id, sender_id: this.state.sender_id, category: "Transfer", amount: this.state.amount };
              axios.put(getIP()+'/students/balance/', payload)
              .then(response => {
                axios.post(getIP()+'/transactions/', transaction_payload)
                .then(response => {
                })
                .catch(error => console.log(error))
              })
            })
            .catch(error => console.log(error))
          })
          .catch(error => console.log(error))
          this.setState({show:false});
        });
        break;
      }
    }

    
  }

  render() {
    return (
      <View style={[styles.classroomContainer, {
        flexDirection: "column"
      }]}>
      
        <View style={{ flex: 1 }}>

          <Text style={styles.header}>{this.state.class_name}</Text>
          <Text style={styles.subHeader}>{this.state.teacher.last_name}</Text>
        </View>

        <View style={{ flex: 6 }}>
            <View>
              <FlatList
                data = {this.state.students}
                renderItem = {({item})=> {
                  return this.renderData(item)
                }}
                keyExtractor = {item => item.id.toString()}
              />
            </View>
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
                  <Text>Recipient: {this.state.name}</Text>
                  <TextInput
                    label="Amount"
                    mode = 'outlined'
                    onChangeText={this.onAmountChange.bind(this)}
                  ></TextInput>
                  <Button onPress={() => {this.createTransaction()}}>Send Money</Button>
                </View>

              </View>


            </Modal>
          
        </View>
      </View>
    );
  }
};

export default function(props) {
  const navigation = useNavigation();

  return <ClassroomScreen {...props} navigation={navigation} />;
}
