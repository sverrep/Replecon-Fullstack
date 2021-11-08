import React from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import getIP from '../../settings.js';
import './StudentClassApp.css';
import NavBar from '../../Components/navbar/Navbar.js';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

class StudentClass extends React.Component {
    constructor(props) {
        
        super(props);
        this.state = {
            students: [],
            classroom: '', 
            clicked: {},
            active: false,
            teacher: '',
            class_name: '',
            balance:'',
            name: '',
            value:'',
            sender_id: '',
            recipient_id: '',
            current_user_name:'',

            current_user_id: 0,

            showAlert: false,
            variant: '',
            message: '',

        }
        this.alertClicked = this.alertClicked.bind(this)
        this.renderCards = this.renderCards.bind(this)
        this.renderModal = this.renderModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.sendTransfer = this.sendTransfer.bind(this)
    }
    
    componentDidMount(){
        axios.get(getIP()+'/students/current/')
        .then(response => { 
            this.setState({current_user_id: response.data.id})
            this.setState({current_user_name: response.data.first_name})
        })
        .catch(error => console.log(error))
        
        this.getClassStudents()
        this.getStudentBalance()
    }

    getStudentBalance(){
        axios.get(getIP()+'/students/balance/')
                .then(response => {  
                    this.setState({balance:response.data})
                })
                .catch(error => console.log(error))
    }

    validateTransfer(){
        if(isNaN(this.state.value)){
            this.setState({variant:'danger'})
            this.setState({message:'Please enter a vaild number'})
            this.setState({showAlert:true})
            return false
        }
        else if(Math.sign(this.state.value)<0 || this.state.value === '0'){
            this.setState({variant:'danger'})
            this.setState({message:'Please enter a postive number'})
            this.setState({showAlert:true})
            return false
        }
        else{
            if(this.state.balance<this.state.value){
                this.setState({variant:'danger'})
                this.setState({message:'You dont have that amount of money'})
                this.setState({showAlert:true})
                return false
            }
            else{
                this.setState({variant:'success'})
                this.setState({message:'Money Sent'})
                this.setState({showAlert:true})
                this.setState({active:false})
                return true
            }
        }
        
    }

    createTransaction(){
        if(this.validateTransfer()){
        for (let i = 0; i <= this.state.students.length-1; i++)
        {
            if (this.state.students[i].name === this.state.name)
            {
                this.setState({ recipient_id: this.state.students[i].id }, () => {
                axios.get(getIP()+'/students/current/')
                .then(response => {
                    this.setState({sender_id: response.data.id}, () => {
                    const payload = { user_id: this.state.recipient_id, amount: this.state.value, recipient: false };
                    const transaction_payload = { recipient_id: this.state.recipient_id, sender_id: this.state.sender_id, category: "Transfer", amount: this.state.value };
                    axios.put(getIP()+'/students/balance/', payload)
                    .then(response => {
                        axios.post(getIP()+'/transactions/', transaction_payload)
                        .then(response => {
                            this.getStudentBalance()
                        })
                        .catch(error => console.log(error))
                    })
                    })
                    .catch(error => console.log(error))
                })
                .catch(error => console.log(error))
                this.setState({show:false});
                });
                break;
            }
        }
    }
}

    getClassStudents() {
        axios.get(getIP()+'/students/class_code/')
        .then(response => {
          this.setState({ students: response.data });
          this.setState({ classroom: this.state.students[0].class_code })
          this.getClassroomDetails()
        })
        .catch(error => console.log(error))
    }

    getClassroomDetails(){
        axios.get(getIP()+'/classrooms/')
        .then(response => {
          this.findClassroom(response.data)
    
        })
        .catch(error => console.log(error))
      }
    
      findClassroom(classrooms){
        for (let i = 0; i <= classrooms.length-1; i++)
        {
            
          if (classrooms[i].class_code === this.state.classroom)
          {
            this.setState({ class_name: classrooms[i].class_name });
            axios.get(getIP()+'/teachers/')
            .then(response => {
              for(let j = 0; j <= response.data.length-1; j++)
              {
                if (response.data[j].id === classrooms[i].teacher_id)
                {
                  this.setState({teacher: response.data[j].last_name})
                }
              }
            })
            .catch(error => console.log(error))
          }
        }
      }

    renderCards(item){
        return(
        <ListGroup.Item action onClick={() => this.alertClicked(item)}>
            {item.name}
        </ListGroup.Item>
        )
    }

    alertClicked(item){
        if(this.state.current_user_id === item.id){
        }
        else{
            this.setState({clicked: item})
            this.setState({active: true})
            this.setState({name: item.name})
        }
        
    }

    renderModal(){

        if(this.state.active === true){
            
            return(
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>Money Transfer to: {this.state.clicked.name}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        
                        <Form.Control onChange={e => this.setState({value: e.target.value})} type="email" placeholder="Enter the amount to send" />
                    </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.closeModal()}>Cancel</Button>
                    <Button variant="primary" className='classroom-button' onClick={() => this.sendTransfer()}>Send</Button>
                </Modal.Footer>
            </Modal.Dialog>
        )
        }
    }
    
    closeModal(){
        this.setState({active:false})
    }

    sendTransfer(){
        this.createTransaction()
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
                <NavBar/>
                <div className='classroom-content'>
                <div className='title'>
                    <h3>{this.state.class_name} - Mr.{this.state.teacher}</h3>
                    <h6>Current Balance: {this.state.balance}</h6>
                </div>
                <div className='classroom-boxes'>
                <div className="student-list">
                    <ListGroup>
                    {this.state.students.map(item => {
                        return(this.renderCards(item))
                    })}
                    </ListGroup>
                    
                </div>
                <div className='transfer'>
                    {this.renderAlert(this.state.variant, this.state.message)}
                    {this.renderModal()}
                </div>
                </div>
                </div>
                <div className='footer'>
                    <p>Your classroom: {this.state.classroom}</p>
                </div>

                
            </div>
        )
    }
}

export default withRouter(StudentClass)