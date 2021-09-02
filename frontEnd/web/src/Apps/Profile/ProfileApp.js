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
        this.state = { email: '', password: '', first_name: '', last_name: '', user_id: '', teacher_id: '', class_code: '', balance: '', transactions: [],  bought_items: [], role: this.props.location.state.role, classes: [], redirect_login: false, redirect_class: false, selected_class: [] };
        this.handleLogOut = this.handleLogOut.bind(this)
    }

    componentDidMount(){
        axios.get(getIP()+'/students/current/')
        .then(response => {
            if(this.state.role === "Student")
            {
                this.setState({first_name: response.data.first_name, user_id: response.data.id, email: response.data.username})
              this.getStudentBalance()
              this.getStudentTransactions()
              this.getBoughtItems()
            }
            else if(this.state.role === "Teacher")
            {
                this.getTeacherClasses()
                this.setState({first_name: response.data.user.first_name, last_name: response.data.teacher.last_name, user_id: response.data.user.id, email: response.data.user.username, teacher_id: response.data.teacher.id})
            }
        })
        .catch(error => console.log(error))
    }

    getTeacherClasses(){
        axios.get(getIP()+'/classrooms/')
        .then(response => {
            this.findTeacherClassrooms(response.data)
        })
        .catch(error => console.log(error))
      }
    
      findTeacherClassrooms(classrooms){
        for (let i = 0; i <= Object.keys(classrooms).length-1; i++)
        {
          if (classrooms[i].teacher_id === this.state.teacher_id)
          {
            this.setState({ classes: [...this.state.classes, classrooms[i]] });
          }
        }
      }

    handleLogOut() {
        axios.get(getIP()+'/auth/logout/')
          .then(response => {
            axios.defaults.headers.common.Authorization = null
            this.setState({ redirect_login : true})
          })
          .catch(error =>  console.log(error));
      }
      
    handleClassRedirect(item){
        this.setState({class_code: item.class_code, redirect_class: true, selected_class: item})
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
        else if(this.state.redirect_class){
            return(
                <Redirect to={{pathname: `/Class/${this.state.class_code}`, state: {class: this.state.selected_class, teacher_id: this.state.teacher_id}}}></Redirect>
            );
        }
        else if (this.state.role === "Student"){
            return (
                <div className='wrapper'>
                    <NavBar/>
                    <h3>Welcome Back {this.state.first_name}</h3>
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
                                        return <li key={item.id} className='green'>{this.renderCard(item)}</li>;
                                    }
                                    else{
                                        return <li key={item.id} className='red'>{this.renderCard(item)}</li>;
                                    }
                                })}
                            </ul>   
                        </div>

                        <div className='boughtItems'>
                            <h2>Bought Items</h2>
                            <ul>
                                {this.state.bought_items.map(item => {
                                    return <li key={item.id} className='grey'>{this.renderItemCard(item)}</li>;
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }
        else if (this.state.role === "Teacher"){
            return (
            <div>
                <h3>Teacher Profile {this.state.teacher_id}</h3>
                
                <h4>Your Classes</h4>
                    <ul>
                        {this.state.classes.map((item,i) => <li key={i}><button onClick={() => this.handleClassRedirect(item)}>{item.class_name} {item.class_code}</button></li>)}
                    </ul>
                <button>
                    Create New Class
                </button>
                <br></br>
                <button onClick={this.handleLogOut}>
                    Log Out
                </button>
            </div>
            );
        }
            
        
    }
}

export default withRouter(Profile)