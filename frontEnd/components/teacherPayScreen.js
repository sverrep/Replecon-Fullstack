import 'react-native-gesture-handler';
import React, { Component } from "react";
import { View, Text, FlatList } from "react-native";
import { Button, Card, TextInput } from 'react-native-paper';
import { TabRouter, useNavigation } from '@react-navigation/native';
import styles from '../componentStyles.js'
import axios from 'axios';

class TeacherPayScreen extends Component {
    
    state = {
        students: [],
        class_name: "",
        selected: [],
        amount: "",
    }

    componentDidMount(){
        this.teacherPaySetUp()
    }

    onAmountChange(text) {
        this.setState({ amount: text });
      } 

    teacherPaySetUp(){
        const {route} = this.props
        const { students, class_name } = route.params;
        this.setState({class_name:class_name})
        this.setState({students:students})
        for(let i = 0; i <= Object.keys(students).length-1; i++)
        {
            this.setState(prevState => ({selected: [...prevState.selected, students[i].id]}))           
        }
        
    }

    paySelected(){
        var selected = this.state.selected
        console.log(selected)
        for(let i = 0; i <= Object.keys(selected).length-1; i++)
        {
            var payload = { user_id: selected[i], amount: this.state.amount }; 
            axios.put(getIP()+'/students/balance/', payload)
            .then(response => {
                axios.post(getIP()+'/transactions/teacherPayStudents/', {"user_id": response.data.user, "amount": this.state.amount})
                .then(response => {
                })
                .catch(error => console.log(error))
            })
            .catch(error => console.log(error))
        }

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

    renderData(item) {
        var select = false;
        for(let i = 0; i <= Object.keys(this.state.selected).length-1; i++)
        {
            if(item.id == this.state.selected[i])
            {
                select = true;
                break;
            }
        }
        if (select == true)
        {
            return(
                <Card style={styles.teacherPayCards} onPress = {() => this.clickedItem(item)}>
                  <Text style={{ textAlign: "left" }}> {item.name}</Text>
                </Card>
            )
        }
        else if (select == false)
        {
            return(
                <Card style={styles.studentCards} onPress = {() => this.clickedItem(item)}>
                    <Text style={{ textAlign: "left" }}> {item.name}</Text>
                </Card>
            )
        }
        
      }

    clickedItem(item){
        var select = false;
        var index = 0;
        for(let i = 0; i <= Object.keys(this.state.selected).length-1; i++)
        {
            if(item.id == this.state.selected[i])
            {
                select = true;
                index = i;
                break;
            }
        }
        if(select == true)
        {
            var temparray = this.state.selected
            temparray.splice(index, 1)
            this.setState({selected: temparray})
        }
        else
        {
            this.setState(prevState => ({selected: [...prevState.selected, item.id]}))
        }
    }

    renderButtons(){
        const teacher_pay_params = {"students": this.state.students, "class_name": this.state.class_name}
        return(
            <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                <TextInput
                    label="Amount"
                    mode = 'outlined'
                    onChangeText={this.onAmountChange.bind(this)}
                  ></TextInput>
                <View style = {{padding: 5, marginTop:10 }}>
                    <Button
                    style={{backgroundColor: "#24a0ed"}}
                    mode = 'contained'
                    onPress = {() => this.paySelected()}
                    >
                    Pay Selected
                    </Button>
                </View>
                <View style = {{padding: 5, marginTop:10 }}>
                    <Button
                    style={{backgroundColor: "#24a0ed"}}
                    mode = 'contained'
                    >
                    Pay All
                    </Button>
                </View>
            </View>
        )
    }

    render() {
      
      return (
        <View style={[styles.classroomContainer, {
            flexDirection: "column"
          }]}>
          
            <View style={{ flex: 1 }}>
              <Text style={styles.header}>Pay Class {this.state.class_name}</Text>
            </View>
    
            <View style={{ flex: 7 }}>
                <View>
                    {this.renderFlatList()}
                </View>
            </View>

            <View style={{flex:5}}>
                {this.renderButtons()}
            </View>
        </View>
      );
    }
}
  
  export default function(props) {
    const navigation = useNavigation();
  
    return <TeacherPayScreen {...props} navigation={navigation} />;
  }