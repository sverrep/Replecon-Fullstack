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

        }
        this.alertClicked = this.alertClicked.bind(this)
        this.renderCards = this.renderCards.bind(this)
        this.renderModal = this.renderModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.sendTransfer = this.sendTransfer.bind(this)
    }
    
    componentDidMount(){
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

    createTransaction(){
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
        this.setState({clicked: item})
        this.setState({active: true})
        this.setState({name: item.name})
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
                    <Button variant="primary" onClick={() => this.sendTransfer()}>Send</Button>
                </Modal.Footer>
            </Modal.Dialog>
        )
        }
    }
    
    closeModal(){
        this.setState({active:false})
    }

    sendTransfer(){
        console.log(this.state.value)
        this.createTransaction()
    }

    render(){
        return(
            <div>
                <NavBar/>
                
                <h3>{this.state.class_name} - Mr.{this.state.teacher}</h3>
                <div className="student-list">
                    <ListGroup>
                    {this.state.students.map(item => {
                        return(this.renderCards(item))
                    })}
                    </ListGroup>
                    <p>Your classroom: {this.state.classroom}</p>
                </div>
                <div className='transfer'>
                    {this.renderModal()}
                </div>
            </div>
        )
    }
}

export default withRouter(StudentClass)