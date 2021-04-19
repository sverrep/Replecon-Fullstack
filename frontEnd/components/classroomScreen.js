import 'react-native-gesture-handler';
import React, { Component, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Modal,
  
} from "react-native";

import { useNavigation } from '@react-navigation/native';
import styles from '../componentStyles.js'
import { NavigationContainer } from '@react-navigation/native';
import { Button, Card, TextInput, IconButton } from 'react-native-paper';

const mydata = [
  {id: 1, name: 'steven'},
  {id: 2,  name: 'john'},
  {id: 3,  name: 'sverre'},
  {id: 4,  name: 'bob'},
  {id: 5,  name: 'lolxdgottem'},
  {id: 6,  name: 'steven'},
  {id: 7,  name: 'steven'},
  {id: 8, name: 'steven'},
  {id: 9,  name: 'steven'},
  {id: 10,  name: 'steven'},
  {id: 11,  name: 'steven'},
  {id: 12,  name: 'steven'},
]






class ClassroomScreen extends Component {
  constructor(){
    super();
    this.state={
      show:false,
      name:"",
    }

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

  render() {
    return (
      <View style={[styles.classroomContainer, {
        flexDirection: "column"
      }]}>
      
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>This is the classroom Screen</Text>
          
        </View>

        <View style={{ flex: 4}}>

            <View>
              <FlatList
                data = {mydata}
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

                  ></TextInput>
                  <Button onPress={() => {this.setState({show:false})}}>Send Money</Button>
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
