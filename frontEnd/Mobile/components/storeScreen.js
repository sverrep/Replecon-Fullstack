import 'react-native-gesture-handler';
import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  Modal,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import styles from '../componentStyles.js'
import {Card, IconButton, Button } from 'react-native-paper';
import axios from 'axios';

class StoreScreen extends Component {
  
  state ={
    class_code:'',
    store_name:'',
    store_id: 0,
    shops:[],
    students: [],
    items: [],
    show:false,
    specific_item_name: '',
    specific_price: '',
    specific_description:'',
    student_balance: '',
  }
  //Card set ups
  clickedItem = (data) => {
    this.setState({show:true})
    this.setState({specific_item_name:data.item_name})
    this.setState({specific_price:data.price})
    this.setState({specific_description:data.description})
  }

  renderData = (item) => {
    return(
      
      <Card style={styles.studentCards} onPress = {() => this.clickedItem(item)}>
        <Text style={styles.subHeader}>{item.item_name}   {item.price}</Text>
        <Text style={{ textAlign: "left" }}>{item.description}</Text>
      </Card>
    )
  
  }
  //Classroom Store Setups
  getClassCode(){
    axios.get(getIP()+'/students/class_code/')
    .then(response => {
      this.setState({ students: response.data });
      this.setState({ class_code: this.state.students[0].class_code })
      this.getShops()
    })
    .catch(error => console.log(error))
  }

  getShops(){
    axios.get(getIP()+'/shops/')
    .then(response => {
      this.setState({shops: response.data})
      this.findShopName(response.data)
    })
    .catch(error => console.log(error))
  }

  findShopName(shops){
    for (let i = 0; i<=Object.keys(shops).length -1;i++)
    {
      if(shops[i].class_code==this.state.class_code)
      {
        this.setState({store_name:shops[i].shop_name})
        this.setState({store_id: shops[i].id})

      }
    }
    this.getItems()
  }

  getItems(){
    axios.get(getIP()+'/items/')
    .then(response => {
      this.getShopItems(response.data)
    })
    .catch(error => console.log(error))

  }

  getShopItems(allItems){
    var ar = []
    for(let i = 0; i<=Object.keys(allItems).length -1; i++)
    {
      if(allItems[i].shop_id==this.state.store_id)
      {
        ar.push(allItems[i])
      }
    }
    this.setState({items:ar})
  }

  componentDidMount(){
    this.getClassCode()
    this.getStudentBalance()
  }

  getStudentBalance()
  {
    axios.get(getIP()+'/students/balance/')
    .then(response => {
      this.setState({student_balance: response.data})
    })
    .catch(error => console.log(error))
  }

  validatePurchase()
  {
    console.log(this.state.student_balance)
    if(this.state.student_balance >= this.state.specific_price)
    {
      return true
    }
    else
    {
      alert("You do not have enough money!")
      return false
    }
  }

  purchaseItem(){
    if(this.validatePurchase())
    {
      axios.post(getIP()+'/items/boughtitems/', { item_name: this.state.specific_item_name })
      .then(response => {
        axios.get(getIP()+'/students/store/')
        .then(response => {
          axios.put(getIP()+'/students/balance/', { amount: this.state.specific_price, user_id: response.data, recipient: false })
          .then(response => {
            axios.post(getIP()+'/transactions/buyFromStore/', { amount: this.state.specific_price })
            .then(response => {
              this.setState({show:false})
              this.getStudentBalance()
            })
            .catch(error => console.log(error + "transactions"))
          })
        . catch(error => console.log(error + "students"))
        })
        .catch(error => console.log(error + "store account"))
      })
      .catch(error => console.log(error + "items"))
    } 
}

  render(){
    return(
      <View style={[styles.storeContainer, {
        flexDirection: "column"
      }]}>
        
        <View>
          <Text style = {styles.header}>{this.state.store_name}</Text>
        </View>
        
        <View>
          <FlatList
            data = {this.state.items}
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
            <View style = {{backgroundColor:'#ffffff', margin:50, padding:40, borderRadius:10, marginTop:200, marginBottom:400, flex:1}} >
              <View style = {{position: 'absolute', right:0, top:0}}>
                <IconButton
                  icon="close-box-outline"
                  color= 'grey'
                  size={20}
                  onPress={() => {this.setState({show:false})}}
                />
              </View>
              <Text style = {styles.subHeader}>{this.state.specific_item_name}</Text>
              <Text style = {{marginTop:10, marginBottom:10}}>{this.state.specific_description}</Text>
              <Button mode='contained' onPress={() => {this.purchaseItem()}}>Purchase for {this.state.specific_price}</Button>
            </View>
          </View>
        </Modal>

      </View>
    )
  }
}

export default function(props) {
  const navigation = useNavigation();

  return <StoreScreen {...props} navigation={navigation} />;
}