import React from 'react';
import { withRouter, Redirect } from "react-router-dom";
import axios from 'axios';
import getIP from '../../settings.js';
import NavBar from '../../Components/navbar/Navbar.js';
import './StudentBankApp.css';

class StudentBank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bank_name: '',
            class_name: '',
            classroom: '',
        }
        this.getClassroomDetails = this.getClassroomDetails.bind(this)
        this.findClassroom = this.findClassroom.bind(this)
        this.getClassStudents = this.getClassStudents.bind(this)
        this.getBanks = this.getBanks.bind(this)
    }

    componentDidMount(){
        this.getClassStudents()
    }
    //Retrieving the class name
    getClassStudents() {
        axios.get(getIP()+'/students/class_code/')
        .then(response => {
            this.setState({ classroom: response.data[0].class_code })
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
            console.log(classrooms[i].class_name)
          }
        }
    }
    
    //Getting the inrest rate

    getBanks(){
        axios.get(getIP()+'/banks/')
        .then(response => {
          this.setState({banks: response.data})
          this.getBankDetails(response.data)
        })
        .catch(error => console.log(error))
      }
    
      getBankDetails(banks){
        for (let i = 0; i<=Object.keys(banks).length -1;i++)
        {
          if(banks[i].class_code==this.state.class_code)
          {
            this.setState({interest_rate:banks[i].interest_rate})
            this.setState({payout_rate:banks[i].payout_rate})
          }
        }
      }

    render(){
        return(
        <div>
            <NavBar/>
            <div className='bank-info'>
                <h1>Bank of {this.state.class_name}</h1>
                <h3>Current Intrest Rate: </h3>
            </div>
            <div>
                <h2>My Savings</h2>
            </div>
        </div>
        )
    }

}

export default withRouter(StudentBank)