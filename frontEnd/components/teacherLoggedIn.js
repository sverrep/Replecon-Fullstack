import 'react-native-gesture-handler';
import React, { Component } from "react";
import { View, Text } from "react-native";
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

class TeacherSignedIn extends Component {
    render() {
      return (
        <View style={{ flex: 1 }}>
            <Text>YO TEACHER</Text>
            <Button
            mode = 'contained'
            onPress = {() =>{this.props.navigation.navigate('TeacherClass')}}
            >Class Page</Button>
        </View>
      );
    }
  }
  
  export default function(props) {
    const navigation = useNavigation();
  
    return <TeacherSignedIn {...props} navigation={navigation} />;
  }
  
  
  
