import 'react-native-gesture-handler';
import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import styles from '../componentStyles.js'
import { Button, Card } from 'react-native-paper';
import getIP from "./settings/settings.js";
import axios from 'axios';


const renderData = (item) => {
  return(
    
    <Card style={styles.studentCards}>
      <Text style={{ textAlign: "left" }}> {item.name}</Text>
    </Card>
  )

}


class ClassroomScreen extends Component {

  state = {
    students: [],
    class_code: "",
    class_name: "",
    teacher_id: "",
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
    for (let i = 0; i < Object.keys(classrooms).length-1; i++)
    {
      if (classrooms[i].class_code == this.state.class_code)
      {
        this.setState({ class_name: classrooms[i].class_name });
        this.setState({ teacher_id: classrooms[i].teacher_id })
      }
    }
  }

  componentDidMount(){
    this.getClassStudents()
  }

  render() {
    return (
      <View style={[styles.classroomContainer, {
        flexDirection: "column"
      }]}>
      
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>{this.state.class_name}</Text>
          <Text style={styles.subHeader}>{this.state.teacher_id}</Text>
        </View>

        <View style={{ flex: 6 }}>
          
            <View>
              <FlatList
                data = {this.state.students}
                renderItem = {({item})=> {
                  return renderData(item)
                }}
                keyExtractor = {item => item.id.toString()}
              />
            </View>
          
        </View>
      </View>
    );
  }
};

export default function(props) {
  const navigation = useNavigation();

  return <ClassroomScreen {...props} navigation={navigation} />;
}
