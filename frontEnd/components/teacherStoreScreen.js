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
        
        showUpdateItem:false,
        showAddItem:false,
        showCreateStore: false,

        spec_item_name: '',
        spec_item_desc: '',
        spec_item_price: 0,
        spec_item_id: 0,

        new_item_name: '',
        new_item_desc: '',
        new_item_price: 0,

        store_name: '',

        showError: false,
        error: '',
    }

    onUpdateItemNameChange(text){
        this.setState({ spec_item_name: text, showError: false });
    }
    
    onUpdateItemDescChange(text){
        this.setState({ spec_item_desc: text, showError: false });
    }

    onUpdateItemPriceChange(text){
        this.setState({ spec_item_price: text, showError: false });
    }

    onNewItemNameChange(text){
        this.setState({ new_item_name: text, showError: false });
    }
    
    onNewItemDescChange(text){
        this.setState({ new_item_desc: text, showError: false });
    }

    onNewItemPriceChange(text){
        this.setState({ new_item_price: text, showError: false });
    }
    
    onStoreNameChange(text){
        this.setState({ store_name: text, showError: false });
    }

    displayError(){
       return this.state.showError && <Text style={{color: "red"}}>{this.state.error}</Text>
    }

    clickedItem = (data) => {
        this.setState({showUpdateItem:true})
        this.setState({spec_item_name:data.item_name})
        this.setState({spec_item_price:data.price})
        this.setState({spec_item_desc:data.description})
        this.setState({spec_item_id:data.id})
    }

    addItemClicked(){
        this.setState({showAddItem:true})
    }

    createStoreClicked(){
        this.setState({showCreateStore:true})
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
                this.setState({classHasShop:true, store_name: shops[i].shop_name, shop_id: shops[i].id})
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

    getItem(){
        axios.get(getIP()+'/items/'+ this.state.spec_item_id)
        .then(response => {
        })
        .catch(error => console.log(error))
    }
    
    updateItem(){
        axios.put(getIP()+'/items/'+ this.state.spec_item_id, {
            item_name: this.state.spec_item_name,
            description: this.state.spec_item_desc,
            price: this.state.spec_item_price,
            shop: this.state.shop_id,
        })
        .then(response => {
          console.log(response.data)
        })
        .catch(error => console.log(error))
    }

    deleteItem(){
        axios.delete(getIP()+'/items/'+ this.state.spec_item_id)
        .then(response => {
          this.setState({showUpdateItem: false, items: []})
          this.getItems()

        })
        .catch(error => console.log(error))
    }
    renderUpdateModal(){
        return(
            
            <Modal
                    transparent = {true}
                    visible = {this.state.showUpdateItem}
                >
                    <View style = {{backgroundColor:'#000000aa', flex:1}}>
                        <View style = {{backgroundColor:'#ffffff', margin:20, padding:20, borderRadius:10, marginTop:100, bottom: 50, flex:1}} >
                        <View style = {{position: 'absolute', right:0, top:0}}>
                            <IconButton
                            icon="close-box-outline"
                            color= 'grey'
                            size={20}
                            onPress={() => {this.setState({showUpdateItem:false})}}
                            />
                        </View>
                        <Text>Item Details:</Text>
                            <View style={{flexDirection: 'row', marginTop:10}}>
                                <View style={{flex:2, marginRight:5}}>
                                    <TextInput
                                    defaultValue= {this.state.spec_item_name}
                                    label="Item Name"
                                    mode = 'outlined'
                                    onChangeText={this.onUpdateItemNameChange.bind(this)}
                                    ></TextInput>

                                </View>
                                
                                <View style={{flex: 1, marginLeft: 5}}>
                                <TextInput
                                defaultValue= {this.state.spec_item_price}
                                label="Item Price"
                                mode = 'outlined'
                                onChangeText={this.onUpdateItemPriceChange.bind(this)}
                                ></TextInput>
                                </View>
                            </View>
                        
                        <View style={{marginTop:10}}>
                            <TextInput
                                defaultValue= {this.state.spec_item_desc}
                                label="Item Description"
                                mode = 'outlined'
                                onChangeText={this.onUpdateItemDescChange.bind(this)}
                            ></TextInput>
                        </View>
                        
                        <View style = {{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15}}>
                            <View>
                                <Button 
                                mode = 'contained'
                                color = '#18E1FF'
                                onPress = {() => this.updateItem()}
                                >Update</Button>
                            </View>

                            <View>
                                <Button
                                mode = 'contained'
                                color = "#FF1818"
                                onPress = {() => this.deleteItem()}
                                >Delete</Button>
                            </View>
                            
                        </View>
                        
                        </View>
                    </View>
                </Modal>
        )

    }

    validateAddItem(){
        if(this.state.new_item_name != '')
        {
            if(!isNaN(this.state.new_item_price))
            {
                if(Math.sign(parseFloat(this.state.new_item_price)) == 1)
                {
                    if(this.state.new_item_desc)
                    {
                        return true
                    }
                    else
                    {
                        this.setState({error: "Please enter a valid item description", showError: true})
                    }
                }
                else
                {
                    this.setState({error: "Please enter a valid item price", showError: true})
                }
            }
            else
            {
                this.setState({error: "Please enter a number", showError: true})
            }
            
            
        }
        else
        {
            this.setState({error: "Please enter a valid item name", showError: true})
        }
    }

    addItem(){
        if(this.validateAddItem())
        {
            axios.post(getIP()+'/items/', {
                item_name: this.state.new_item_name,
                description: this.state.new_item_desc,
                price: this.state.new_item_price,
                shop: this.state.shop_id,
            })
            .then(response => {
                this.setState({showAddItem: false, items: [...this.state.items, response.data]})
            })
            .catch(error => console.log(error))
        }
       
    }

    renderAddModal(){
        return(
            <Modal
                transparent = {true}
                visible = {this.state.showAddItem}
            >
                <View style = {{backgroundColor:'#000000aa', flex:1}}>
                    <View style = {{backgroundColor:'#ffffff', margin:20, padding:20, borderRadius:10, marginTop:100, bottom: 50, flex:1}} >
                        <View style = {{position: 'absolute', right:0, top:0}}>
                            <IconButton
                            icon="close-box-outline"
                            color= 'grey'
                            size={20}
                            onPress={() => {this.setState({showAddItem:false})}}
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
                        <View style={{alignItems: 'center'}}>
                            {this.displayError()}
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
                    <Text style = {styles.header}>{this.state.store_name} Admin Page</Text>
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
                    onPress = {() => this.addItemClicked()}
                    >Add an Item</Button>
                </View>
                {this.renderUpdateModal()}
                {this.renderAddModal()}

                
                
            </View>
        )
    }

    createNewStore(){
        if(this.state.store_name != "")
        {
            axios.post(getIP()+'/shops/', {
                shop_name: this.state.store_name,
                classroom: this.state.class_code,
            })
            .then(response => {
              this.setState({showCreateStore: false, classHasShop: true})
            })
            .catch(error => console.log(error))
        }
        else
        {
            this.setState({error: "Please enter a valid store name", showError: true})
        }
    }

    renderCreateStore(){
        return(
            <Modal
                transparent = {true}
                visible = {this.state.showCreateStore}
            >
                <View style = {{backgroundColor:'#000000aa', flex:1}}>
                    <View style = {{backgroundColor:'#ffffff', margin:20, padding:20, borderRadius:10, marginTop:100, bottom: 50, flex:1}} >
                        <View style = {{position: 'absolute', right:0, top:0}}>
                            <IconButton
                            icon="close-box-outline"
                            color= 'grey'
                            size={20}
                            onPress={() => {this.setState({showCreateStore:false})}}
                            />
                        </View>
                        <Text> Store Creation:</Text>
                        <View style={{marginTop:10}}>
                            <TextInput
                                label="Store Name"
                                mode = 'outlined'
                                onChangeText={this.onStoreNameChange.bind(this)}
                            ></TextInput>
                        </View>
                        <View style ={{marginTop:10}}>
                            <Button 
                            mode = 'contained'
                            color = '#0FBC1A'
                            onPress = {() => this.createNewStore()}
                            >Create Store</Button>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            {this.displayError()}
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
    
    hasNoShop(){
        return(
            <View style={[styles.classroomContainer, {
                flexDirection: "column"
              }]}>
                <View style={{flex:1}}>
                    <Text style = {styles.header}>Store Admin Page</Text>
                </View>

                <View style = {{flex:5}}>
                    <Text style= {styles.subHeader}>This class doesn't have a store yet, start setting one up by creating a store</Text>
                    <Button
                    mode = 'contained'
                    onPress = {() => this.createStoreClicked()}
                    >Create a store</Button>
                </View>
                {this.renderCreateStore()}
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

    componentDidMount(){
        const {route} = this.props
        const class_code = route.params;
        this.setState({class_code:class_code})
        this.getShops()
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