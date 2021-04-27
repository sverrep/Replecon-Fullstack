import 'react-native-gesture-handler';
import React, { Component } from "react";
import { View, Text, FlatList, Modal } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { FAB, Card, Button, IconButton, TextInput } from 'react-native-paper';
import styles from '../componentStyles.js';
import getIP from './settings/settings.js';
import axios from 'axios';
import { makeClassCode } from './logic/classCodeGenerator.js'

class TeacherSignedIn extends Component {
  
  state = {
    first_name: "",
    last_name: "",
    user_id: "",
    teacher_id: "",
    classes: [],
    new_class_name: "",
    show: false,
    new_class_code: "",
  }

  componentDidMount(){
      this.getTeacherName()
  }

  onNewClassNameChange(text){
    this.setState({ new_class_name: text });
  }

  logOutRequest() {
    axios.get(getIP()+'/auth/logout/')
      .then(response => {
        axios.defaults.headers.common.Authorization = null
        this.props.navigation.navigate('Login');
      })
      .catch(error =>  console.log(error));
  }

  getTeacherName(){
    axios.get(getIP()+'/students/current/')
    .then(response => {
      this.setState({first_name: response.data.user.first_name})
      this.setState({last_name: response.data.teacher.last_name})
      this.setState({user_id: response.data.user.id})
      this.setState({teacher_id: response.data.teacher.id}, () => {
        this.getTeacherClasses()
      })
    })
    .catch(error => console.log(error))
  }

  getTeacherClasses(){
    axios.get(getIP()+'/classrooms/')
    .then(response => {
      this.findTeacherClassrooms(response.data)
    })
    .catch(error => console.log(error))
  }

  findTeacherClassrooms(classrooms){
    for (let i = 0; i <= Object.keys(classrooms).length-1; i++)
    {
      if (classrooms[i].teacher_id == this.state.teacher_id)
      {
        this.setState({ classes: [...this.state.classes, classrooms[i]] });
      }
    }
  }

  renderData = (item) => {
    return(
      <View>
        <Card style={styles.studentCards} onPress = {() => this.props.navigation.navigate('TeacherClass', item)}>
          <View style={{flexDirection: "row", justifyContent:'space-between'}}>
            <View>
              <Text style={{ textAlign: "left" }}> {item.class_name} </Text>
            </View>
            <View>
              <Text style={{ textAlign: "right" }}> {item.class_code} </Text>
            </View>
          </View>
        </Card>
      </View>
    )
  
  }

  createClass(){
    axios.get(getIP()+'/classrooms/')
    .then(response => {
      this.setState({new_class_code: makeClassCode(response.data)}, () => {
        const payload = {class_name: this.state.new_class_name, teacher_id: this.state.teacher_id, class_code: this.state.new_class_code}
        console.log(payload)
        axios.post(getIP()+'/classrooms/', payload)
        .then(response => {
          this.setState({show: false}, () => {
            this.setState({ classes: [...this.state.classes, response.data] });
          })
        })
        .catch(error => console.log(error))
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
      <Text style={ {marginTop: 20, fontWeight: 'bold', fontSize: 20} }>Hello, {this.state.first_name} {this.state.last_name}</Text>
        <FAB
          style = {styles.fab}
          small = {true}
          icon = 'logout-variant'

          onPress={this.logOutRequest.bind(this)}
        />  
      </View>
      
      <View style={{flex: 1, alignItems:'center'}}>
        <Button style={styles.createClassBtn} onPress = {() => this.setState({show:true})}><Text style={{color: "black"}}>Create New Class</Text></Button>
      </View>
      
      <View style={{ flex: 8 }}>
        <Text style = {styles.header}>Your Classes</Text>
        <FlatList
          data = {this.state.classes}
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
              <Text>New Class Name:</Text>
              <TextInput
                label="Name"
                mode = 'outlined'
                onChangeText={this.onNewClassNameChange.bind(this)}
              ></TextInput>
              <Button onPress={() => {this.createClass()}}>Create Class</Button>
            </View>
          </View>
        </Modal>
    </View>

    );
  }
}

  export default function(props) {
    const navigation = useNavigation();
  
    return <TeacherSignedIn {...props} navigation={navigation} />;
  }
  
  
  
