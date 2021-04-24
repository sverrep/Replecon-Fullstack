import 'react-native-gesture-handler';
import React, { Component } from "react";
import { View, Text, FlatList, Modal } from "react-native";
import { Button, Card, IconButton, TextInput  } from 'react-native-paper';
import { TabRouter, useNavigation } from '@react-navigation/native';
import styles from '../componentStyles.js'
import axios from 'axios';

class TeacherStoreScreen extends Component {

    state={
        class_code: '',
        shops: [],
        shop_id: 0,
        classHasShop: false,
        items: [],
        show:false,
        showAdd:false,
        spec_item_name: '',
        spec_item_desc: '',
        spec_item_price: '',

        new_item_name: '',
        new_item_desc: '',
        new_item_price: 0,
    }

    onNewItemNameChange(text){
        this.setState({ new_item_name: text });
    }
    
    onNewItemDescChange(text){
        this.setState({ new_item_desc: text });
    }

    onNewItemPriceChange(text){
        this.setState({ new_item_price: text });
    }

    clickedItem = (data) => {
        this.setState({show:true})
        this.setState({spec_item_name:data.item_name})
        this.setState({spec_item_price:data.price})
        this.setState({spec_item_desc:data.description})
    }

    addClicked(){
        this.setState({showAdd:true})
    }

    renderData = (item) => {
        return(
          <View>
            <Card style={styles.studentCards} onPress = {() => this.clickedItem(item)}>
                <Text style={styles.subHeader}>{item.item_name}   {item.price}</Text>
                <Text style={{ textAlign: "left" }}>{item.description}</Text>
            </Card>
          </View>
        )
      
    }

    getShops(){
        axios.get(getIP()+'/shops/')
        .then(response => {
          this.setState({shops: response.data})
          this.checkForShop(response.data)
        })
        .catch(error => console.log(error))
    }

    checkForShop(shops){
        for(let i = 0; i <= Object.keys(shops).length - 1; i++){
            if(shops[i].classroom == this.state.class_code){
                this.setState({classHasShop:true})
                this.setState({shop_id: shops[i].id})
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
          if(allItems[i].shop==this.state.shop_id)
          {
            ar.push(allItems[i])
          }
        }
        this.setState({items:ar})
    }

    componentDidMount(){
        const {route} = this.props
        const class_code = route.params;
        this.setState({class_code:class_code})
        this.getShops()
    }

    renderUpdateModal(){
        return(

            <Modal
                    transparent = {true}
                    visible = {this.state.show}
                >
                    <View style = {{backgroundColor:'#000000aa', flex:1}}>
                        <View style = {{backgroundColor:'#ffffff', margin:20, padding:20, borderRadius:10, marginTop:100, bottom: 50, flex:1}} >
                        <View style = {{position: 'absolute', right:0, top:0}}>
                            <IconButton
                            icon="close-box-outline"
                            color= 'grey'
                            size={20}
                            onPress={() => {this.setState({show:false})}}
                            />
                        </View>
                        <Text>Item Details:</Text>
                            <View style={{flexDirection: 'row', marginTop:10}}>
                                <View style={{flex:2, marginRight:5}}>
                                    <TextInput
                                    defaultValue= {this.state.spec_item_name}
                                    label="Item Name"
                                    mode = 'outlined'
                                    
                                    ></TextInput>

                                </View>
                                
                                <View style={{flex: 1, marginLeft: 5}}>
                                <TextInput
                                defaultValue= {this.state.spec_item_price}
                                label="Item Price"
                                mode = 'outlined'
                                
                                ></TextInput>
                                </View>
                            </View>
                        
                        <View style={{marginTop:10}}>
                            <TextInput
                                defaultValue= {this.state.spec_item_desc}
                                label="Item Description"
                                mode = 'outlined'
                                //onChangeText={this.onNewClassNameChange.bind(this)}
                            ></TextInput>
                        </View>
                        
                        <View style = {{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15}}>
                            <View>
                                <Button 
                                mode = 'contained'
                                color = '#18E1FF'
                                >Update</Button>
                            </View>

                            <View>
                                <Button
                                mode = 'contained'
                                color = "#FF1818"
                                >Delete</Button>
                            </View>
                            
                        </View>
                        
                        </View>
                    </View>
                </Modal>
        )

    }

    addItem(){
        
        axios.post(getIP()+'/items/', {
            item_name: this.state.new_item_name,
            description: this.state.new_item_desc,
            price: this.state.new_item_price,
            shop: this.state.shop_id,

        })
        .then(response => {
          
        })
        .catch(error => console.log(error))
    }

    renderAddModal(){
        return(
            <Modal
                transparent = {true}
                visible = {this.state.showAdd}
            >
                <View style = {{backgroundColor:'#000000aa', flex:1}}>
                    <View style = {{backgroundColor:'#ffffff', margin:20, padding:20, borderRadius:10, marginTop:100, bottom: 50, flex:1}} >
                        <View style = {{position: 'absolute', right:0, top:0}}>
                            <IconButton
                            icon="close-box-outline"
                            color= 'grey'
                            size={20}
                            onPress={() => {this.setState({showAdd:false})}}
                            />
                        </View>
                        <Text>Item Details:</Text>
                        <View style={{flexDirection: 'row', marginTop:10}}>
                            <View style={{flex:2, marginRight:5}}>
                                <TextInput
                                    label="Item Name"
                                    mode = 'outlined'
                                    onChangeText={this.onNewItemNameChange.bind(this)}
                                ></TextInput>

                            </View>
                            <View style={{flex: 1, marginLeft: 5}}>
                                <TextInput
                                    label="Item Price"
                                    mode = 'outlined'
                                    onChangeText={this.onNewItemPriceChange.bind(this)}
                                ></TextInput>
                            </View>
                        </View>
                        <View style={{marginTop:10}}>
                            <TextInput
                                label="Item Description"
                                mode = 'outlined'
                                onChangeText={this.onNewItemDescChange.bind(this)}
                            ></TextInput>
                        </View>
                        
                        <View style ={{marginTop:10}}>
                            <Button 
                            mode = 'contained'
                            color = '#0FBC1A'
                            onPress = {() => this.addItem()}
                            >Add Item</Button>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    hasShop(){
        return(
            <View style={[styles.classroomContainer, {
                flexDirection: "column"
              }]}>
                <View style={{flex:1}}>
                    <Text style = {styles.header}>Store Admin Page</Text>
                </View>

                <View style = {{flex:5}}>
                    <FlatList
                        data = {this.state.items}
                        renderItem = {({item})=> {
                        return this.renderData(item)
                        }}
                        keyExtractor = {item => item.id.toString()}
                    />
                    <Button
                    mode = 'contained'
                    onPress = {() => this.addClicked()}
                    >Add an Item</Button>
                </View>
                {this.renderUpdateModal()}
                {this.renderAddModal()}

                
                
            </View>
        )
    }

    hasNoShop(){
        return(
            <View>
                <Text>This class has no shop, try setting one up</Text>
            </View>
        )
    }

    renderShopView(){
        if(this.state.classHasShop == true)
        {
            return(
                this.hasShop()
            )
        }

        else{
            return(
                this.hasNoShop()
            )
        }
        
    }

    render(){
        return(
            this.renderShopView()
        )
    }

}

export default function(props) {
    const navigation = useNavigation();
  
    return <TeacherStoreScreen {...props} navigation={navigation} />;
  }