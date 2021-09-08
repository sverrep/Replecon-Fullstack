import axios from 'axios';
import React from 'react';
import { Redirect } from "react-router-dom";
import getIP from '../../settings.js';
import './LoginApp.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default class LoginApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', redirect_student_profile: false, redirect_student_signup: false, redirect_teacher_signup: false, error: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleStudentSignUpRedirect = this.handleStudentSignUpRedirect.bind(this);
    this.handleTeacherSignUpRedirect = this.handleTeacherSignUpRedirect.bind(this);
  }

  render() {
    if (this.state.redirect_student_signup){
      return(
        <Redirect to={{pathname: '/SignUp', state: { role: "Student" }}}></Redirect>
      )
    }
    else if (this.state.redirect_teacher_signup){
      return(
        <Redirect to={{pathname: '/SignUp', state: { role: "Teacher" }}}></Redirect>
      )
    }
    else if(this.state.redirect_student_profile){
      return(
        <Redirect to={{pathname: '/Profile', state: { email: this.state.email, role: "Student" }}}></Redirect>
      )
    }
    else if(this.state.redirect_teacher_profile){
      return(
        <Redirect to={{pathname: '/Profile', state: { email: this.state.email,  role: "Teacher" }}}></Redirect>
      )
    }
    else{
      return (
        <div>
        <Container className="login-container">
          <div className="vertical-center">
            <Row>
              <h1 className="logo-h1">REPLECON</h1>
              <h3 className="login-h3">Login</h3>
            </Row>
            <Row>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={this.handleChange} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={this.handleChange}/>
              </Form.Group>
            </Row>
            <p className="error-message">{this.state.error}</p>
            <div className="login-btns-row">
              <Button variant="primary" className="login-btns" onClick={() => this.handleLogin()}> Login </Button>
            </div>
            <div className= "login-btns-row">
              <Button variant="secondary" className="login-btns" onClick={this.handleStudentSignUpRedirect} > Student Sign Up </Button>
              <Button variant="secondary" className="login-btns" onClick={this.handleTeacherSignUpRedirect} >Teacher Sign Up</Button>
            </div>
            
          </div>
        </Container>
        <div className='footerlog'>
          <p>SPSO Solutions ©</p>
        </div>
        </div>
      );
    }
  }

  handleStudentSignUpRedirect(){
    this.setState({ redirect_student_signup : true })
  }

  handleTeacherSignUpRedirect(){
    this.setState({ redirect_teacher_signup : true })
  }

  handleChange(e) {
    const field = e.target.id
    this.setState({ [field] : e.target.value });
  }

  validateData() 
  {
    var reg = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(this.state.email))
    {
      if(this.state.password.length === 0){
          this.setState({error: "Password needs to be longer", showError: true})
      }
      else{
        return true
      }
    }
    else
    {
      this.setState({error: "Email is invalid", showError: true})
    } 
  }

  handleLogin() {
    if (this.validateData()) {
      const payload = { username: this.state.email, password: this.state.password } 
      axios.post(getIP()+'/auth/login/', payload)
      .then(response => {
        const { token } = response.data;
        axios.defaults.headers.common.Authorization = `Token ${token}`;
        axios.get(getIP()+'/teachers/isTeacher/')
        .then(response => {
          if(response.data === true) {
            this.setState({ redirect_teacher_profile : true})
            return
          }
          else {
            this.setState({ redirect_student_profile : true})
            return
          }
        })
        .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
      this.setState({error: "User Not Found"})
      return
    }
    else {
      return
    }
    
  }
}
