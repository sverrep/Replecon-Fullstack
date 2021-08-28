import React from 'react';
import { withRouter, Redirect } from "react-router-dom";
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
            students: [{id: '1', name: 'Bob', balance: '123'}, {id: '2', name: 'Carl', balance: '69'}, {id: '3', name: 'Jerry', balance: '420'}],
            classroom: '', 
            clicked: {},
            active: false,
        }
        this.alertClicked = this.alertClicked.bind(this)
        this.renderCards = this.renderCards.bind(this)
        this.renderModal = this.renderModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.sendTransfer = this.sendTransfer.bind(this)
    }
    
    componentDidMount(){
        this.setState({classroom: '11CHL'})
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
                        
                        <Form.Control type="email" placeholder="Enter the amount to send" />
                    </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.closeModal()}>Cancel</Button>
                    <Button variant="primary">Send</Button>
                </Modal.Footer>
            </Modal.Dialog>
        )
        }
    }
    
    closeModal(){
        this.setState({active:false})
    }

    sendTransfer(){

    }

    render(){
        return(
            <div>
                <NavBar/>
                <h3>Your classroom: {this.state.classroom}</h3>
                <div>
                    <ListGroup>
                    {this.state.students.map(item => {
                        return(this.renderCards(item))
                    })}
                    </ListGroup>
                    {console.log(this.state.clicked)}
                </div>
                <div>
                    {this.renderModal()}
                </div>
            </div>
        )
    }
}

export default withRouter(StudentClass)