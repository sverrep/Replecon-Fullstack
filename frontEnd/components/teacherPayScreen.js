import 'react-native-gesture-handler';
import React, { Component } from "react";
import { View, Text, FlatList, Modal } from "react-native";
import { Button, Card, TextInput, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from '../componentStyles.js'
import axios from 'axios';

class TeacherPayScreen extends Component {
    
    state = {
        students: [],
        class_name: "",
        selected: [],
        amount: "",
        show: false,
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
        this.setState({show:false})
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

    renderPopUp(){
        return (
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
                <Text>Pay selected students {this.state.amount}?</Text>
                <Button onPress={() => {this.paySelected()}}>Pay Students</Button>
                </View>
            </View>
        </Modal>
        );
    }

    renderButtons(){
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
                    onPress = {() => this.setState({show: true})}
                    >
                    Pay Selected
                    </Button>
                </View>
            </View>
        )
    }

    render() {
      
      return (
        <View style={[styles.classroomContainer, {flexDirection: "column"}]}>
          
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
            {this.renderPopUp()}
            

        </View>
      );
    }
}
  
  export default function(props) {
    const navigation = useNavigation();
  
    return <TeacherPayScreen {...props} navigation={navigation} />;
  }