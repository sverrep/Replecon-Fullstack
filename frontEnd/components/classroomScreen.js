import 'react-native-gesture-handler';
import React, { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  
} from "react-native";

import { useNavigation } from '@react-navigation/native';
import styles from '../componentStyles.js'
import { NavigationContainer } from '@react-navigation/native';
import { Button, Card, Avatar, Title, Paragraph  } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

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
              <Card style={styles.studentCards}>
                <Text style={{ textAlign: "left" }}> Steven Ohrdorf</Text>
              </Card>
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
