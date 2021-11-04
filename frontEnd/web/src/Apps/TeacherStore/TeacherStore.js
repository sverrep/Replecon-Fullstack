import React from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import getIP from '../../settings.js';
import './TeacherStore.css';
import navbar from '../../Components/navbar/Teacher NavBar/TeacherNavbar';
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Modal from 'react-bootstrap/Modal'
import Card from 'react-bootstrap/Card'


class TeacherStore extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            class_code: this.props.location.state.class.class_code, 
            class_name: this.props.location.state.class.class_name,
            teacher_id:  this.props.location.state.teacher_id,

            shops: [],
            shop_id: 0,
            classHasShop: false,
            items: [],
            showUpdateItem:false,
            showAddItem:false,
            showCreateStore: false,
            showImportItems: false,
            item_name: '',
            item_desc: '',
            item_price: 0,
            item_id: 0,
            store_name: '',
            item_import_class_code: '',
            item_import_store: [],
            item_import_list: [],
            store_error: '',
        };
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        const field = e.target.id
        this.setState({ [field] : e.target.value });
    }

    componentDidMount(){
        this.getShops()
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
          if(shops[i].class_code === this.state.class_code){
            this.setState({classHasShop:true, store_name: shops[i].shop_name, shop_id: shops[i].id})
          }
        }
        this.getItems("local")
    }

    async importHasShop(){
        var completed = false
        await axios.get(getIP()+'/shops/')
        .then(async (response) => {
          for(let i = 0; i <= Object.keys(response.data).length - 1; i++){
            if(response.data[i].class_code === this.state.item_import_class_code){
              this.setState({item_import_store: response.data[i]})
              await this.getItems("import")
              completed = true
            }
          }
        })
        .catch(error => console.log(error))
        if(completed)
        {
          return true
        }
        else
        {
          return false
        }
    }

    async getItems(type){
        await axios.get(getIP()+'/items/')
        .then(async (response) => {
          return await this.getShopItems(response.data, type)
        })
        .catch(error => console.log(error))
    }

    async getShopItems(allItems, type){
        var ar = []
        if(type === "local")
        {
          for(let i = 0; i<=Object.keys(allItems).length -1; i++)
          {
            if(allItems[i].shop_id === this.state.shop_id)
            {
              ar.push(allItems[i])
            }
          }
          this.setState({items:ar})
          return true
        }
        else if(type === "import")
        {
          for(let i = 0; i<=Object.keys(allItems).length -1; i++)
          {
            if(allItems[i].shop_id === this.state.item_import_store.id)
            {
              ar.push(allItems[i])
            }
          }
          this.setState({item_import_list:ar})
          return true
        }
    }

    createNewStore(){
        if(this.state.store_name !== "")
        {
          axios.post(getIP()+'/shops/', {
            shop_name: this.state.store_name,
            class_code: this.state.class_code,
          })
          .then(response => {
            this.setState({showCreateStore: false, classHasShop: true, shop_id: response.data.id})
          })
          .catch(error => console.log(error))
        }
        else
        {
          this.setState({store_error: "Please enter a valid store name"})
        }
    }
    
    addItem(){
        if(this.validateItem())
        {
          axios.post(getIP()+'/items/', {
            item_name: this.state.item_name,
            description: this.state.item_desc,
            price: this.state.item_price,
            shop_id: this.state.shop_id,
          })
          .then(response => {
            this.setState({showAddItem: false, items: [...this.state.items, response.data]})
          })
          .catch(error => console.log(error))
        }
    }
    
    updateItem(){
        if(this.validateItem())
        {
          axios.put(getIP()+'/items/'+ this.state.item_id, {
            item_name: this.state.item_name,
            description: this.state.item_desc,
            price: this.state.item_price,
            shop_id: this.state.shop_id,
          })
          .then(response => {
            this.setState({showUpdateItem: false, items: []})
            this.getItems("local")
          })
          .catch(error => console.log(error))
        }
    }
    
    storeClickedItem(name, price, description, id){
        this.setState({showUpdateItem:true})
        this.setState({item_name:name})
        this.setState({item_price:price})
        this.setState({item_desc:description})
        this.setState({item_id:id})
    }
    
    deleteItem(){
        axios.delete(getIP()+'/items/'+ this.state.item_id)
        .then(response => {
          this.setState({showUpdateItem: false, items: []})
          this.getItems("local")
        })
        .catch(error => console.log(error))
    }
      
    importStoreItems(){
        axios.get(getIP()+'/classrooms/')
        .then(async (response) => {
          for(let i = 0; i <= Object.keys(response.data).length - 1; i++){
            if(this.state.item_import_class_code === response.data[i].class_code)
            {
              var passed = await this.importHasShop()
              if(passed)
              {
                for(i = 0; i<Object.keys(this.state.item_import_list).length; i++)
                {
                  axios.post(getIP()+'/items/', {
                    item_name: this.state.item_import_list[i].item_name,
                    description: this.state.item_import_list[i].description,
                    price: this.state.item_import_list[i].price,
                    shop_id: this.state.shop_id,
                  })
                  .then(response => {
                    this.setState({showImportItems: false, items: [...this.state.items, response.data]})
                  })
                  .catch(error => console.log(error))
                }   
              }
            }
          }
        })
        .catch(error => console.log(error))
    }

    renderStoreItems2(){
        return(
            <Row xs={1} md={2} lg={3} xl={5}>
                {this.state.items.map((item,i) => (
                    <Col>
                        <Card className="store-cards">
                            <Card.Body>
                                <Card.Title>{item.item_name}{" $" + item.price}</Card.Title>
                                <Card.Text> 
                                    {item.description}
                                    <br/>
                                    <Button className="card-btns" onClick={() => this.storeClickedItem(item.item_name, item.price, item.description, item.id)}>Update Item</Button> 
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                </Row>
        );
    }

    hasShop(){
        return (
          <Col className="store-col">
            <h4>{this.state.store_name} Store</h4>
            <Row className="store-row">
                {this.renderStoreItems2()}
            </Row>
            <Row className="store-btn-row">
                <Button variant="primary" className="store-btns" onClick={() => this.setState({showAddItem: true})}>
                    Add Item
                </Button>
                <Button variant="primary" className="store-btns" onClick={() => this.setState({showImportItems: true})}>
                    Import Store Items
                </Button>
            </Row>
            {this.addItemModal()}
            {this.updateItemModal()}
            {this.importStoreItemsModal()}
          </Col>
        );
    }

    hasNoShop(){
        return (
          <Col>
            <h4>This class has no store</h4>
            <Button variant="primary" className="store-btns" onClick={() => this.setState({showCreateStore: true})}>
              Create A Store
            </Button>
            {this.createStoreModal()}
          </Col>
        );
    }

    renderShopView(){
        if(this.state.classHasShop)
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

    validateItem(){
        if(this.state.item_name !== '')
        {
            if(!isNaN(this.state.item_price))
            {
                if(Math.sign(parseFloat(this.state.item_price)) === 1)
                {
                    if(this.state.item_desc)
                    {
                        return true
                    }
                    else
                    {
                        this.setState({store_error: "Please enter a valid item description"})
                    }
                }
                else
                {
                    this.setState({store_error: "Please enter a valid item price"})
                }
            }
            else
            {
                this.setState({store_error: "Please enter a number"})
            }
            
            
        }
        else
        {
            this.setState({store_error: "Please enter a valid item name"})
        }
    }

    createStoreModal(){
        return (
          <Modal
            show={this.state.showCreateStore}
            onHide={() => this.setState({showCreateStore: false})}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Create A Store
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FloatingLabel label="Store Name" className="modal-input">
                <FormControl id='store_name' placeholder="Interest Rate" onChange={this.handleChange}/>
              </FloatingLabel>
              <p>{this.state.store_error}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-btn" onClick={() => this.createNewStore()}>Create Store</Button>
            </Modal.Footer>
          </Modal>
        );
    }
    
    addItemModal(){
        return (
          <Modal
            show={this.state.showAddItem}
            onHide={() => this.setState({showAddItem: false})}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Add An Item
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <Col xs={12} md={8}>
                    <FloatingLabel label="Item Name" className="modal-input">
                      <FormControl id='item_name' placeholder="Item Name" onChange={this.handleChange}/>
                    </FloatingLabel>
                  </Col>
                  <Col xs={6} md={4}>
                    <FloatingLabel label="Item Price" className="modal-input">
                      <FormControl id='item_price' placeholder="Item Price" onChange={this.handleChange}/>
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <FloatingLabel label="Item Description" className="modal-input">
                    <FormControl id='item_desc' placeholder="Item Description" onChange={this.handleChange} />
                  </FloatingLabel>
                </Row>
              </Container>
              <p>{this.state.store_error}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-btn" onClick={() => this.addItem()}>Add Item</Button>
            </Modal.Footer>
          </Modal>
        );
    }
    
    updateItemModal()
      {
        return (
          <Modal
            show={this.state.showUpdateItem}
            onHide={() => this.setState({showUpdateItem: false})}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Update An Item
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <Col xs={12} md={8}>
                    <FloatingLabel label="Item Name" className="modal-input">
                      <FormControl id='item_name' placeholder="Item Name" defaultValue={this.state.item_name} onChange={this.handleChange}/>
                    </FloatingLabel>
                  </Col>
                  <Col xs={6} md={4}>
                    <FloatingLabel label="Item Price" className="modal-input">
                      <FormControl id='item_price' placeholder="Item Price" defaultValue={this.state.item_price} onChange={this.handleChange}/>
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <FloatingLabel label="Item Description" className="modal-input">
                    <FormControl id='item_desc' placeholder="Item Description" defaultValue={this.state.item_desc} onChange={this.handleChange} />
                  </FloatingLabel>
                </Row>
              </Container>
              <p>{this.state.store_error}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-btn" onClick={() => this.updateItem()}>Update Item</Button>
              <Button className="modal-btn" onClick={() => this.deleteItem()}>Delete Item</Button>
            </Modal.Footer>
          </Modal>
        );
    }
    
    importStoreItemsModal(){
        return (
          <Modal
            show={this.state.showImportItems}
            onHide={() => this.setState({showImportItems: false})}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Import Items from Another Class Store
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FloatingLabel label="Class Code" className="modal-input">
                <FormControl id='item_import_class_code' placeholder="Class Code" onChange={this.handleChange}/>
              </FloatingLabel>
              <p>{this.state.store_error}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-btn" onClick={() => this.importStoreItems()}>Import Items</Button>
            </Modal.Footer>
          </Modal>
        );
    }

    render(){
        return(
            <div className="wrapper">
                {navbar("Econ12", {class_code: this.state.class_code, class_name: this.state.class_name}, this.state.teacher_id)}
                <Container className="store-container">
                    <Row className="content-row">
                        {this.renderShopView()}
                    </Row>
                </Container>
            </div>
        );
    }
}

export default withRouter(TeacherStore)