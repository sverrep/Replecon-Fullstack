import 'react-native-gesture-handler';
import React, { Component } from "react";
import { View, Text, FlatList } from "react-native";
import { Button, Card } from 'react-native-paper';
import { TabRouter, useNavigation } from '@react-navigation/native';
import styles from '../componentStyles.js'
import axios from 'axios';

class TeacherClassScreen extends Component {
    
    state = {
        students: [],
        class_code: '',
    }

    renderData = (item) =>{
        return(
            <View>
            <Card style={styles.studentCards}>
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
    renderButtons(){
        return(
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <View style = {{padding: 5, marginTop:10 }}>
                    <Button
                    mode = 'contained'
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
                        >
                        Items
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
          //this.setState({ test: response.data });
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
        const {route} = this.props
        const{class_name, class_code} = route.params;
        this.setState({class_name:class_name})
        this.setState({class_code:class_code})
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
            
        </View>
      );
    }
  }
  
  export default function(props) {
    const navigation = useNavigation();
  
    return <TeacherClassScreen {...props} navigation={navigation} />;
  }
  