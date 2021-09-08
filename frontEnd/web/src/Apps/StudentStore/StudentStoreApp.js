import React from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import getIP from '../../settings.js';
import NavBar from '../../Components/navbar/Navbar.js';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import './StudentStoreApp.css';
class StudentStore extends React.Component {
    constructor(props) {
        
        super(props);
        this.state = {
            student_balance: '',
            class_code:'',
            store_name:'',
            store_id: 0,
            shops:[],
            students: [],
            items: [],

        }
        this.getStudentBalance = this.getStudentBalance.bind(this)
        this.getClassCode = this.getClassCode.bind(this)
    }

    componentDidMount(){
        this.getStudentBalance()
        this.getClassCode()
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
        for (let i = 0; i<=shops.length -1;i++)
        {
        if(shops[i].class_code===this.state.class_code)
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
        for(let i = 0; i<=allItems.length -1; i++)
        {
        if(allItems[i].shop_id===this.state.store_id)
        {
            ar.push(allItems[i])
        }
        }
        this.setState({items:ar})
        }

    //Student Balance
    getStudentBalance()
    {
        axios.get(getIP()+'/students/balance/')
        .then(response => {
            this.setState({student_balance: response.data})
            })
        .catch(error => console.log(error))
    }

    renderCard(item){
        return(
            <Card style={{ width: '15rem', padding: '10px' }} className='cards'>
                <Card.Body>
                    <Card.Title>{item.item_name}</Card.Title>
                    <Card.Text>
                        {item.description}
                    </Card.Text>
                    <Button variant="primary" onClick={() => this.buyItem(item)}>Purchase</Button>
                </Card.Body>
            </Card>
        )
    }


    //Purchasing of Item

    buyItem(item){
        axios.post(getIP()+'/items/boughtitems/', { item_name: item.item_name })
            .then(response => {
                axios.get(getIP()+'/students/store/')
                    .then(response => {
                    axios.put(getIP()+'/students/balance/', { amount: item.price, user_id: response.data, recipient: false })
                        .then(response => {
                        axios.post(getIP()+'/transactions/buyFromStore/', { amount: item.price })
                            .then(response => {
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
    render(){
        return(
            <div className='wrapper'>
                <NavBar/>
                <div className='title'>
                    <h3>{this.state.store_name}</h3>
                    <h5>Your current balance: {this.state.student_balance} </h5>
                </div>
                <div className="item-cards">
                    <div className='override'>
                        <Row xs="auto" md={2}>
                    {this.state.items.map(item => {
                            return(this.renderCard(item))
                        })}
                        </Row>
                    </div>
                </div>
            </div>

        )
    }

}
export default withRouter(StudentStore)