import React from 'react';
import { withRouter, Redirect } from "react-router-dom";
import axios from 'axios';
import getIP from '../../settings.js';
import './ProfileApp.css';
import NavBar from '../../Components/navbar/Navbar.js';
import Button from 'react-bootstrap/Button';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '', name: '', user_id: '', class_code: '', redirect_login: false, redirect_profile: false, balance: '', transactions: [],
        bought_items: [] };
        this.handleLogOut = this.handleLogOut.bind(this)
    }

    componentDidMount(){
        axios.get(getIP()+'/students/current/')
        .then(response => {
            this.getStudentBalance()
            this.getStudentTransactions()
            this.getBoughtItems()
            this.setState({name: response.data.first_name})
            this.setState({user_id: response.data.id})
            this.setState({email: response.data.username})
        })
        .catch(error => console.log(error))
    }

    handleLogOut() {
        axios.get(getIP()+'/auth/logout/')
          .then(response => {
            axios.defaults.headers.common.Authorization = null
            this.setState({ redirect_login : true})
          })
          .catch(error =>  console.log(error));
      }

    getStudentBalance() {
     axios.get(getIP()+'/students/balance/')
    .then(response => {
        const balance = response.data
        this.setState({balance})
    })
    .catch(error =>  console.log(error));
    }

    getStudentTransactions(){
        axios.get(getIP()+'/transactions/getAllStudentTransactions/')
        .then(response =>{
          this.setState({transactions: response.data})
        })
    .catch(error => console.log(error))
    }

    getBoughtItems(){
        axios.get(getIP()+'/items/boughtitems/')
        .then(response => {
        this.setState({bought_items: response.data})
        })
        
        .catch(error => console.log(error))
    }

    renderCard(item){
        var transCard = 'From ' + item.name + " " +  item.symbol + item.amount
        return(transCard)
        
    }

    renderItemCard(item){
        return item.item_name
    }
    

    render() {
        if(this.state.redirect_login){
            return(
                <Redirect to={{pathname: '/Login'}}></Redirect>
            )
        }
        else{
            return (
                <div className='wrapper'>
                    <NavBar/>
                    <h3>Welcome Back {this.state.name}</h3>
                    <p>
                        Current Balance: {this.state.balance}  
                    </p>
                    <Button variant='primary' onClick={this.handleLogOut}>
                        Log Out
                    </Button>
                    <div className='content'>
                        <div className='transactions'>
                            <h2>Transactions History</h2>
                            <ul>
                                {this.state.transactions.map(item => {
                                    if(item.symbol === '+'){
                                        return <li className='green'>{this.renderCard(item)}</li>;
                                    }
                                    else{
                                        return <li className='red'>{this.renderCard(item)}</li>;
                                    }
                                })}
                            </ul>   
                        </div>

                        <div className='boughtItems'>
                            <h2>Bought Items</h2>
                            <ul>
                                {this.state.bought_items.map(item => {
                                    return <li className='grey'>{this.renderItemCard(item)}</li>;
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }
            
        
    }
}

export default withRouter(Profile)