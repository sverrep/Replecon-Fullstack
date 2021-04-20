import 'react-native-gesture-handler';
import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  
} from "react-native";
import styles from '../componentStyles.js'
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createIconSet } from 'react-native-vector-icons';
import {Button } from 'react-native-paper';
import {VictoryPie} from 'victory-native';

class StatsScreen extends Component {
  
  state ={
    income_click:true,
    category:''
  }

  getButtonStyle(but){
    if (this.state.income_click == true && but == 'income')
      return 'contained'
    else if (this.state.income_click == false && but == 'income') 
      return 'outlined'
    else if (this.state.income_click == false && but == 'expense')
      return 'contained'
    else if (this.state.income_click == true && but == 'expense') 
      return 'outlined'
  }

  renderOptionsBar(){
    return(
      <View style={{flexDirection: 'row', padding: 10, justifyContent: 'space-between'}}>
        <View>
          <Text style ={styles.header}>Income - Expenses</Text>
        </View>
  
        <View style={{flexDirection:'row'}}>
          <Button style = {{marginLeft: 10}}
          mode = {this.getButtonStyle("income")}
          onPress={() => {this.setState({income_click:true}), console.log("Income")}}
          >
            Income
          </Button>

          <Button style = {{marginLeft: 10}}
          mode = {this.getButtonStyle('expense')}
          onPress={() => {this.setState({income_click:false}), console.log("Expense")}}
          >
            Expenses
          </Button>
        </View>
      </View>
  
    )
  
  }

  renderScreen(){
    if(this.state.income_click == true)
      return(this.renderIncomeView())
    else
      return(this.renderExpensesView())
  }

  proccessDataToDisplay(){
    return [
      {x: 'Class Salary', y: 40},
      {x: 'Students', y: 28},
      {x: 'Banking', y: 32},
    ]
  }

  renderIncomeView(){
    let chartData = this.proccessDataToDisplay()
    return(
      
      <View>
        <VictoryPie
          data = {chartData}
          colorScale = {["red", 'navy', 'orange', "black"]}
          labels={({ datum }) => `${datum.y}%`}
          innerRadius = {70}
          labelRadius={({ innerRadius }) => innerRadius + 20 }

          style={{
            labels: {
              fontSize: 15, fill: "white"
            }
          }}
        />
        
      </View>

      
    )

  }
  
  renderExpensesView(){
    return(
      <Text>This is your expenses stats</Text>
    )
  }
  
  render(){
    return(
      <View>
      {this.renderOptionsBar()}
      {this.renderScreen()}
      <Text>{this.state.categoryName}</Text>
      </View>
    )
  }

}

export default function(props) {
  const navigation = useNavigation();

  return <StatsScreen {...props} navigation={navigation} />;
}