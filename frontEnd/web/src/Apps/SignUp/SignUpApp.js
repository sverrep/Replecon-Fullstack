import React from 'react';
import { withRouter, Redirect } from "react-router-dom";
import axios from 'axios'
import getIP from '../../settings.js';
import './SignUpApp.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import {passwords} from '../../Components/passwords/mostCommon.js'

class SignUpApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: '', 
            password: '', 
            name: '', 
            class_code: '', 
            first_name: '', 
            last_name: '', 
            redirect_login: false, 
            redirect_profile: false, 
            showError: false, 
            error: '',
            token: '',
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSignup = this.handleSignup.bind(this)
        this.handleReturnRedirect = this.handleReturnRedirect.bind(this)
        this.checkClassCode = this.checkClassCode.bind(this)
        this.validateStrongPassword = this.validateStrongPassword.bind(this)
        this.vaildateComplexity = this.vaildateComplexity.bind(this)
    }

    render() {
        if(this.state.redirect_login){
            return(
                <Redirect to={{pathname: '/Login'}}></Redirect>
            );
        }
        else if(this.state.redirect_profile){
            if(this.props.location.state.role === "Student")
            {
                return(
                    <Redirect to={{
                        pathname: '/Profile', 
                        state: { email: this.state.email, name: this.state.name, class_code: this.state.class_code, role: this.props.location.state.role, token: this.state.token }}}>
                    </Redirect>
                );
            }
            else if(this.props.location.state.role === "Teacher")
            {
                return(
                    <Redirect to={{
                        pathname: '/Profile', 
                        state: { role: this.props.location.state.role, token: this.state.token }}}>
                    </Redirect>
                );
            }
            
        }
        else{
            return (
                <Container className="signup-container">
                    <div className="vertical-center">
                        <Row>
                            <h3 className="signup-h3">{this.props.location.state.role} Sign Up</h3>
                        </Row>
                        <Row>
                            {this.setUpCommonFields()}
                            {this.setUpUniqueFields()}
                        </Row>
                        <p className="error-message">{this.state.error}</p>
                        <div className="signup-btns-row">
                            <Button className="signup-btns" onClick={() => this.handleSignup()}>
                            SignUp
                            </Button>
                        </div>
                        <div className="signup-btns-row">
                            <Button className="signup-btns" onClick={this.handleReturnRedirect}>
                            Already have an account? Log In
                            </Button>
                        </div>
                    </div>
                </Container>
        
            );
        }
    }

    setUpCommonFields(){
        return(
            <Row>
                <Form.Group className="mb-3" controlId="email">
                    <FloatingLabel label="Email">
                        <Form.Control id="email" placeholder="Email" onChange={this.handleChange} />
                    </FloatingLabel>
                    <FloatingLabel label="Password">
                        <Form.Control id="password" type="password" placeholder="Password" onChange={this.handleChange} />
                    </FloatingLabel>
                </Form.Group>
            </Row>
        )
    }
    setUpUniqueFields(){
        if(this.props.location.state.role === "Student"){
            return(
                <Row>
                    <Form.Group className="mb-3" controlId="email">
                        <FloatingLabel label="Name">
                            <Form.Control id="name" placeholder="Name" onChange={this.handleChange} />
                        </FloatingLabel>
                        <FloatingLabel label="Class Code">
                            <Form.Control id="class_code" placeholder="Class code" onChange={this.handleChange} />
                        </FloatingLabel>
                    </Form.Group>
                </Row>
            );
        }
        else if(this.props.location.state.role === "Teacher"){
            return( 
                <Row>
                    <Form.Group className="mb-3" controlId="email">
                        <FloatingLabel label="First Name">
                            <Form.Control id="first_name" placeholder="First Name" onChange={this.handleChange} />
                        </FloatingLabel>
                        <FloatingLabel label="Last Name">
                            <Form.Control id="last_name" placeholder="Last Name" onChange={this.handleChange} />
                        </FloatingLabel>
                    </Form.Group>
                </Row>
            );
        }
    }

    validateStrongPassword(password){
        var flag = true
        for(let i= 0; i <= 999; i++){
            if (password === passwords[i]){
                flag = false
            }
        }
        return flag
    }

    vaildateComplexity(password){
        let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
        if(strongPassword.test(password)){
            return true
        }
        else{
            return false
        }
    }

    async validateData() 
    {
        var reg = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(this.state.email))
        {
            if(this.state.password.length === 0){
                this.setState({error: "Password needs to be longer", showError: true})
            }
            else{
                if(this.validateStrongPassword(this.state.password)===false){
                    this.setState({error: "Please use a stronger password", showError: true})
                }
                else{
                    
                    if(this.vaildateComplexity(this.state.password)===false){
                        this.setState({error: "Please use a more complex password. Must be 8 characters long and include at least 1 symbol, uppercase, and number", showError: true})
                    }
                    else{

                        if (this.props.location.state.role === "Student")
                        {
                            if(this.state.name === '')
                            {
                                this.setState({error: "Please enter a name"})
                                return false
                            }
                            else
                            {
                                if(this.state.class_code.length === 6)
                                {
                                    var check = await this.checkClassCode(this.state.class_code)
                                    if(check)
                                    {
                                        return true
                                    }
                                    else
                                    {
                                        this.setState({error: "Please enter an existing class code"})
                                        return false
                                    }        
                                }
                                else
                                {
                                    this.setState({error: "Class Code needs to be 6 characters long", showError: true})
                                    return false
                                }
                            }
                            
                        }
                        else if (this.props.location.state.role === "Teacher")
                        {
                            if(this.state.first_name === '')
                            {
                                this.setState({error: "Please enter a first name"})
                                return false
                            }
                            else
                            {
                                if(this.state.last_name === '')
                                {
                                    this.setState({error: "Please enter a last name"})
                                    return false
                                }
                                else
                                {
                                    return true
                                }
                            }
                        }
                    }
                }
            }
        }
        else
        {
            this.setState({error: "Email is invalid", showError: true})
            return false
        } 
    }

    async checkClassCode(class_code){
        var found = false
        await axios.get(getIP()+'/classrooms/')
        .then(response => {
            var classrooms = response.data
            for (let i = 0; i <= Object.keys(classrooms).length-1; i++)
            {
                if (classrooms[i].class_code === class_code)
                {
                    found = true
                }
            }
        })
        .catch(error => console.log(error))
        return found
    }
    
    handleChange(e) {
        const field = e.target.id
        this.setState({ [field] : e.target.value });
      }
    
    async handleSignup() {
        if(this.props.location.state.role === "Student")
        {
            if (await this.validateData()) {
                const payload = { username: this.state.email, password: this.state.password, first_name: this.state.name } 
                axios.post(getIP()+'/auth/register/', payload)
                .then(response => {
                    this.setState({ token: response.data.token })
                    axios.defaults.headers.common.Authorization = `Token ${this.state.token}`;
                    axios.post(getIP()+'/students/create/', {class_code: this.state.class_code})
                    .then(response => {
                        this.setState({ redirect_profile : true})
                    })
                    .catch(error => console.log(error));
                })            
                return
            }
            else {
                return
            }
        }
        else if(this.props.location.state.role === "Teacher"){
            if (await this.validateData()) {
                const payload = { username: this.state.email, password: this.state.password, first_name: this.state.first_name } 
                axios.post(getIP()+'/auth/register/', payload)
                .then(response => {
                    this.setState({ token: response.data.token })
                    axios.defaults.headers.common.Authorization = `Token ${this.state.token}`;
                    axios.post(getIP()+'/teachers/create/', {last_name: this.state.last_name})
                    .then(response => {
                        this.setState({ redirect_profile : true})
                    })
                    .catch(error => console.log(error));
                })            
                return
            }
            else {
                return
            }
        }
    }
    
    handleReturnRedirect(){
        this.setState({ redirect_login : true })
      }
  }

export default withRouter(SignUpApp)