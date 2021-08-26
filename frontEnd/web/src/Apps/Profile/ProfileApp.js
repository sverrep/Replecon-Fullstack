import React from 'react';
import { withRouter, Redirect } from "react-router-dom";
import axios from 'axios';
import getIP from '../../settings.js';


class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '', first_name: '', last_name: '', user_id: '', teacher_id: '', class_code: '', role: this.props.location.state.role, classes: [], redirect_login: false, redirect_profile: false };
        this.handleLogOut = this.handleLogOut.bind(this)
    }

    componentDidMount(){
        axios.get(getIP()+'/students/current/')
        .then(response => {

            if(this.state.role === "Student")
            {
                this.setState({first_name: response.data.first_name, user_id: response.data.id, email: response.data.username})
            }
            else if(this.state.role === "Teacher")
            {
                this.getTeacherClasses()
                this.setState({first_name: response.data.user.first_name, last_name: response.data.teacher.last_name, user_id: response.data.user.id, email: response.data.user.username, teacher_id: response.data.teacher.id})
            }
            
        })
        .catch(error => console.log(error))
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

    render() {
        if(this.state.redirect_login){
            return(
                <Redirect to={{pathname: '/Login'}}></Redirect>
            )
        }
        else if (this.state.role === "Student"){
            return (
                <div>
                    <h3>Student Profile {this.state.user_id}</h3>
                    <p>
                        {this.state.email}
                        <br></br>
                        {this.state.first_name}
                        <br></br>
                    </p>
                    <button onClick={this.handleLogOut}>
                        Log Out
                    </button>
                </div>
            );
        }
        else if (this.state.role === "Teacher"){
            return (
            <div>
                <h3>Teacher Profile {this.state.teacher_id}</h3>
                
                <h4>Your Classes</h4>
                    <ul>
                        {this.state.classes.map((item,i) => <li key={i}>{item.class_name} {item.class_code}</li>)}
                    </ul>
                <button>
                    Create New Class
                </button>
                <br></br>
                <button onClick={this.handleLogOut}>
                    Log Out
                </button>
            </div>
            );
        }
            
        
    }
}

export default withRouter(Profile)