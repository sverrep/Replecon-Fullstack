import React from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import getIP from '../../settings.js';
import Navbar from '../../Components/navbar/Student NavBar/Navbar.js';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import './StudentStoreApp.css';
import Cookies from 'universal-cookie';

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
            showAlert: false,
            variant: '',
            message: '',

        }
        this.getStudentBalance = this.getStudentBalance.bind(this)
        this.getClassCode = this.getClassCode.bind(this)
    }

    async componentDidMount(){
        const cookies = new Cookies()
        axios.defaults.headers.common.Authorization = cookies.get("Authorization");
        await this.getStudentBalance()
        await this.getClassCode()
    }

    //Classroom Store Setups
    async getClassCode(){
        await axios.get(getIP()+'/students/class_code/')
        .then(response => {
            this.setState({ students: response.data });
            this.setState({ class_code: this.state.students[0].class_code })
            this.getShops()
        })
        .catch(error => console.log(error))
    }

    async getShops(){
        await axios.get(getIP()+'/shops/')
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
    async getStudentBalance()
    {
        await axios.get(getIP()+'/students/balance/')
        .then(response => {
            this.setState({student_balance: response.data})
            })
            
        .catch(error => console.log(error))
        
    }

    renderCard(item, i){
        return(
            <Card key={i} style={{ width: '15rem', padding: '10px' }} className='cards'>
                <Card.Body>
                    <Card.Title>{item.item_name} ${item.price}</Card.Title>
                    <Card.Text>
                        {item.description} 
                    </Card.Text>
                    <Button variant="primary" className='store-button' onClick={() => this.buyItem(item)}>Purchase</Button>
                </Card.Body>
            </Card>
        )
    }




    async validatePurchase(item){
        await this.getStudentBalance()
        if(this.state.student_balance >= item.price)
    {
        this.setState({variant:'success'})
        this.setState({message:'Item was bought successfully'})
        this.setState({showAlert:true})
        return true
    }
    else
    {
        this.setState({variant:'danger'})
        this.setState({message:'You dont have enough money for this item'})
        this.setState({showAlert:true})
        return false
    }
    }
    //Purchasing of Item

    async buyItem(item){
        if(await this.validatePurchase(item)){
        await axios.post(getIP()+'/items/boughtitems/', { item_id: item.id })
            .then(async response => {
                await axios.get(getIP()+'/students/store/')
                    .then(async response => {
                    await axios.put(getIP()+'/students/balance/', { amount: item.price, user_id: response.data, recipient: false })
                        .then(async response => {
                        await axios.post(getIP()+'/transactions/buyFromStore/', { amount: item.price })
                            .then(async response => {
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

    renderAlert(variant, message){
        
        if(this.state.showAlert){
        return(
        <Alert show={this.state.showAlert} variant={variant} onClose={() => this.setState({showAlert:false})} dismissible>
            <p>
                {message}
            </p>
        </Alert>
        )
        }
    }
    render(){
        return(
            <div className='wrapper'>
                <Navbar/>
                <div className='store-content'>
                <div className='title'>
                    <div className='title-name'><h3>{this.state.store_name}</h3></div>
                    <div className='title-balance'><h3>${this.state.student_balance} </h3></div>
                    
                </div>
                <div className="alert">
                    {this.renderAlert(this.state.variant, this.state.message)}
                    
                </div>
                
                <div className="item-cards">
                    <div className='override'>
                        <Row xs="auto" md={2}>
                    {this.state.items.map((item, i) => this.renderCard(item, i))}
                        </Row>
                    </div>
                </div>
                </div>
            </div>

        )
    }

}
export default withRouter(StudentStore)