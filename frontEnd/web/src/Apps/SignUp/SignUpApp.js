import React from 'react';
import { withRouter, Redirect } from "react-router-dom";
import axios from 'axios'
import getIP from '../../settings.js';


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
            error: '' 
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleReturnRedirect = this.handleReturnRedirect.bind(this)
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
                        state: { email: this.state.email, name: this.state.name, class_code: this.state.class_code, role: this.props.location.state.role }}}>
                    </Redirect>
                );
            }
            else if(this.props.location.state.role === "Teacher")
            {
                return(
                    <Redirect to={{
                        pathname: '/Profile', 
                        state: { role: this.props.location.state.role }}}>
                    </Redirect>
                );
            }
            
        }
        else{
            return (
                <div>
                    <h3>{this.props.location.state.role} SignUp</h3>
                    <form onSubmit={this.handleSubmit}>
                        {this.setUpCommonFields()}
                        {this.setUpUniqueFields()}
                        <p>{this.state.error}</p>
                        <button>
                        SignUp
                        </button>
                    </form>
                    <button onClick={this.handleReturnRedirect}>
                    Already have an account? Log In
                    </button>
                </div>
        
            );
        }
    }

    setUpCommonFields(){
        return(
            <div>
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
            </div>
        )
    }
    setUpUniqueFields(){
        if(this.props.location.state.role === "Student"){
            return(
                <div>
                    <div className="inputfield">
                        <input
                            id="name"
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.name}
                            placeholder="Name"
                        />
                    </div>
                    <div className="inputfield">
                        <input
                            id="class_code"
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.class_code}
                            placeholder="Class Code"
                        />
                    </div>
                </div>
            );
        }
        else if(this.props.location.state.role === "Teacher"){
            return(
                <div>
                    <div className="inputfield">
                        <input
                            id="first_name"
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.first_name}
                            placeholder="First Name"
                        />
                    </div>
                    <div className="inputfield">
                        <input
                            id="last_name"
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.last_name}
                            placeholder="Last Name"
                        />
                    </div>
                </div>
            );
        }
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
            if (this.props.location.state.role === "Student")
            {
                if(this.state.class_code.length === 6)
                {
                    return true
                }
                else
                {
                    this.setState({error: "Class Code needs to be 6 characters long", showError: true})
                    return false
                }
            }
            else
            {
                return true
            }
        }
    }
    else
    {
        this.setState({error: "Email is invalid", showError: true})
        return false
    } 
}
    
    handleChange(e) {
        const field = e.target.id
        this.setState({ [field] : e.target.value });
      }
    
    handleSubmit(e) {
        e.preventDefault();
        if(this.props.location.state.role === "Student")
        {
            if (this.validateData()) {
                const payload = { username: this.state.email, password: this.state.password, first_name: this.state.name } 
                axios.post(getIP()+'/auth/register/', payload)
                .then(response => {
                    const { token } = response.data;
                    axios.defaults.headers.common.Authorization = `Token ${token}`;
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
            if (this.validateData()) {
                const payload = { username: this.state.email, password: this.state.password, first_name: this.state.first_name } 
                axios.post(getIP()+'/auth/register/', payload)
                .then(response => {
                    const { token } = response.data;
                    axios.defaults.headers.common.Authorization = `Token ${token}`;
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