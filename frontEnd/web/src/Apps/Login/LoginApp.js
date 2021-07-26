import axios from 'axios';
import React from 'react';
import { Redirect } from "react-router-dom";
import './LoginApp.css';

const ip = "http://192.168.1.104:8000/"

export default class LoginApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', redirect_student_profile: false, redirect_student_signup: false, redirect_teacher_signup: false, error: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        <Redirect to={{pathname: '/Profile', state: { email: this.state.email }}}></Redirect>
      )
    }
    else{
      return (
        <div>
          <h3>Login</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="inputfield">
              <input
                id="email"
                type="text"
                onChange={this.handleChange}
                value={this.state.email}
                placeholder="Email"
              />
            </div>
            <div className="inputfield">
              <input
                id="password"
                type="password"
                onChange={this.handleChange}
                value={this.state.password}
                placeholder="Password"
              />
            </div>
            <p>{this.state.error}</p>
            <button>
              Login
            </button>
          </form>
          <button onClick={this.handleStudentSignUpRedirect}>
            Student Sign Up
          </button>
          <br></br>
          <button onClick={this.handleTeacherSignUpRedirect}>
            Teacher Sign Up
          </button>
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

  handleSubmit(e) {
    e.preventDefault();
    if (this.validateData()) {
      const payload = { username: this.state.email, password: this.state.password } 
      axios.post(ip+'/auth/login/', payload)
      .then(response => {
          const { token } = response.data;
          axios.defaults.headers.common.Authorization = `Token ${token}`;
          axios.get(ip+'/teachers/isTeacher/')
          .then(response => {
            if(response.data === true) {
              this.setState({ redirect_teacher_profile : true})
            }
            else {
              this.setState({ redirect_student_profile : true})
              return
            }
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
      return
    }
    else {
      return
    }
    
  }
}
