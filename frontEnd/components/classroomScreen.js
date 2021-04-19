import 'react-native-gesture-handler';
import React, { Component, useState } from "react";
import {
  Text,
  View,
  FlatList,
  
} from "react-native";

import { useNavigation } from '@react-navigation/native';
import styles from '../componentStyles.js'
import { NavigationContainer } from '@react-navigation/native';
import { Button, Card, Avatar, Title, Paragraph } from 'react-native-paper';

const mydata = [
  {id: 1, name: 'steven'},
  {id: 2,  name: 'steven'},
  {id: 3,  name: 'steven'},
  {id: 4,  name: 'steven'},
  {id: 5,  name: 'steven'},
  {id: 6,  name: 'steven'},
  {id: 7,  name: 'steven'},
  {id: 8, name: 'steven'},
  {id: 9,  name: 'steven'},
  {id: 10,  name: 'steven'},
  {id: 11,  name: 'steven'},
  {id: 12,  name: 'steven'},
]

const renderData = (item) => {
  return(
    
    <Card style={styles.studentCards}>
      <Text style={{ textAlign: "left" }}> {item.name}</Text>
    </Card>
  )

}


class ClassroomScreen extends Component {
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
