import React from 'react';
import { Redirect } from "react-router-dom";
import './LoginApp.css';

export default class LoginApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', redirect: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    if (this.state.redirect){
      return(
        <Redirect to={{pathname: '/TestApp', state: { email: this.state.email }}}></Redirect>
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
            <button>
              Login
            </button>
          </form>
        </div>
      );
    }
  }

  handleChange(e) {
    const field = e.target.id
    this.setState({ [field] : e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.email.length === 0 || this.state.password.length === 0) {
      return
    }
    else {
      this.setState({ redirect : true})
      return
    }
    
  }
}
