import React from 'react';
import { withRouter, Redirect } from "react-router-dom";
import axios from 'axios';
import getIP from '../../settings.js';


class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '', name: '', user_id: '', class_code: '', redirect_login: false, redirect_profile: false };
        this.handleLogOut = this.handleLogOut.bind(this)
    }

    componentDidMount(){
        axios.get(getIP()+'/students/current/')
        .then(response => {
            this.setState({name: response.data.first_name})
            this.setState({user_id: response.data.id})
            this.setState({email: response.data.username})
        })
        .catch(error => console.log(error))
    }

    handleLogOut() {
        axios.get(getIP()+'/auth/logout/')
          .then(response => {
            axios.defaults.headers.common.Authorization = null
            this.setState({ redirect_login : true})
          })
          .catch(error =>  console.log(error));
      }

    render() {
        if(this.state.redirect_login){
            return(
                <Redirect to={{pathname: '/Login'}}></Redirect>
            )
        }
        else{
            return (
                <div>
                    <h3>Student Profile {this.state.user_id}</h3>
                    <p>
                        {this.state.email}
                        <br></br>
                        {this.state.name}
                        <br></br>
                    </p>
                    <button onClick={this.handleLogOut}>
                        Log Out
                    </button>
                </div>
            );
        }
            
        
    }
}

export default withRouter(Profile)