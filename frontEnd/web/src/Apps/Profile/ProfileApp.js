import React from 'react';
import { withRouter, Redirect } from "react-router-dom";
import axios from 'axios';
import getIP from '../../settings.js';
import './ProfileApp.css';
import navbar from '../../Components/navbar/Student NavBar/Navbar.js';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: '', 
            password: '', 
            first_name: '', 
            last_name: '', 
            user_id: '', 
            teacher_id: '', 
            class_code: '', 
            balance: '',
            new_class_name: '',
            transactions: [],  
            bought_items: [], 
            role: this.props.location.state.role, 
            classes: [], 
            redirect_login: false, 
            redirect_class: false, 
            selected_class: [],
            showCreateClass: false,
            token: this.props.location.state.token,
            showInven:false,
        };
        this.handleLogOut = this.handleLogOut.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.openInven = this.openInven.bind(this)
        this.closeInven = this.closeInven.bind(this)
    }

    componentDidMount(){
        axios.defaults.headers.common.Authorization = `Token ${this.state.token}`;
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

    handleChange(e) {
        const field = e.target.id
        this.setState({ [field] : e.target.value });
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

    createClass(){
        axios.get(getIP()+'/classrooms/')
        .then(response => {
          this.setState({new_class_code: this.makeClassCode(response.data)}, () => {
            const payload = {class_name: this.state.new_class_name, teacher_id: this.state.teacher_id, class_code: this.state.new_class_code}
            axios.post(getIP()+'/classrooms/', payload)
            .then(response => {
              this.setState({showCreateClass: false}, () => {
                this.setState({ classes: [...this.state.classes, response.data] });
              })
            })
            .catch(error => console.log(error))
         })
        })
       .catch(error => console.log(error))
     }

     
    makeClassCode(classrooms) {
        var result = []
        var characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'
        var code_length = 6
        var alreadyExists = false
        
        for ( let i = 0; i < code_length;i++){
            result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
        }
        for (let k = 0; k<=Object.keys(classrooms).length -1;k++)
        {
        if(classrooms[k].class_code === result)
        {
            alreadyExists = true
        }
        }

        if (alreadyExists === false){
            return result.join('')
        }
        else{
            this.makeClassCode(classrooms)
        }
    }


    renderCard(item){
        if(item.symbol === '+'){
            var transCardplus = 'From ' + item.name + " " +  item.symbol + item.amount +"$"
            return(transCardplus)
        }
        else{
            var transCardminus = 'To ' + item.name + " " +  item.symbol + item.amount +"$"
            return(transCardminus)
        }
        }
        
        
        
    

    renderItemCard(item){
        return item.item_name
    }

    createClassModal() {
        return (
          <Modal
            show={this.state.showCreateClass}
            onHide={() => this.setState({showCreateClass: false})}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Create A Class
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FloatingLabel label="Class Name">
                <FormControl id='new_class_name' placeholder="Class Name" onChange={this.handleChange}/>
              </FloatingLabel>
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-btn" onClick={() => this.createClass()}>Create Class</Button>
            </Modal.Footer>
          </Modal>
        );
      }
    
    openInven(){
        this.setState({showInven:true})
    }
    closeInven(){
        this.setState({showInven:false})
    }
    renderInventoryModal(){
        return(
            <Modal
            show={this.state.showInven}
            
            keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>My Inventory</Modal.Title>
                    <Button variant="secondary" onClick={() => this.closeInven()}>Close</Button>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                    <div className='boughtItems'>
                            <ul>
                                {this.state.bought_items.map(item => {
                                    return <li key={item.id} className='grey cardb'>{this.renderItemCard(item)}</li>;
                                })}
                            </ul>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
    render() {
        if(this.state.redirect_login){
            return(
                <Redirect to={{pathname: '/Login'}}></Redirect>
            )
        }
        else if(this.state.redirect_class){
            return(
                <Redirect to={{pathname: `/Class/${this.state.class_code}/students`, state: {class: this.state.selected_class, teacher_id: this.state.teacher_id, token: this.state.token}}}></Redirect>
            );
        }
        else if (this.state.role === "Student"){
            return (
                <div className='wrapper'>
                    {navbar(this.state.token)}
                    <div className='profile-content'>
                    <div className='profile-title'>
                        <div className='profile-name'><h3>{this.state.first_name}</h3></div>
                        
                        <div className='profile-balance'>
                            <Button variant='primary' className='profile-button' onClick={this.handleLogOut}>
                            Log Out
                            </Button>

                            <Button variant='primary' className='inventory-button' onClick={this.openInven}>
                            Inventory
                            </Button>
                            
                        </div>
                        
                    {this.renderInventoryModal()}
                    </div>
                    <h3>${this.state.balance}</h3>
                    <div className='content'>
                        <div>
                            <ul>
                                {this.state.transactions.map(item => {
                                    if(item.symbol === '+'){
                                        return <li key={item.id} className='green cardb'>{this.renderCard(item)}</li>;
                                    }
                                    else{
                                        return <li key={item.id} className='red cardb'>{this.renderCard(item)}</li>;
                                    }
                                })}
                            </ul>   
                        </div>

                        
                    </div>
                    </div>
                </div>
            );
        }
        else if (this.state.role === "Teacher"){
            return (
            <Container className="teacher-container">
                <Row>
                    <h3 className="teacher-h3">Welcome Back {this.state.last_name}</h3>
                    <h4>Your Classes</h4>
                        {this.state.classes.map((item,i) => <ListGroup.Item key={i} className="class-list" action onClick={() => this.handleClassRedirect(item)}>{item.class_name} {item.class_code}</ListGroup.Item>)}
                    <div className="teacher-btns-row">
                        <Button variant="primary" className="teacher-btn-create" onClick={() => this.setState({showCreateClass: true})}>
                            Create New Class
                        </Button>
                    </div>
                    <div className="teacher-btns-row">
                        <Button variant="outline-secondary" className="teacher-btn-logout" onClick={this.handleLogOut}>
                            Log Out
                        </Button>
                    </div>
                </Row>
                {this.createClassModal()}
            </Container>
            );
        }
            
        
    }
}

export default withRouter(Profile)