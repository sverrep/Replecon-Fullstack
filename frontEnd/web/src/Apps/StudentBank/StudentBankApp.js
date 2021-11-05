import React from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import getIP from '../../settings.js';
import NavBar from '../../Components/navbar/Navbar.js';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import './StudentBankApp.css';


class StudentBank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bank_name: '',
            class_name: '',
            classroom: '',
            interest_rate:'',
            payout_rate:'',
            student_balance: '',
            show:false,
            value:'',
            loggedin_student:{},

            savings: [],



        }
        this.getClassroomDetails = this.getClassroomDetails.bind(this)
        this.findClassroom = this.findClassroom.bind(this)
        this.getClassStudents = this.getClassStudents.bind(this)
        this.getBanks = this.getBanks.bind(this)
        this.getStudentBalance = this.getStudentBalance.bind(this)
    }

    componentDidMount(){
        this.getClassStudents()
        this.getBanks()
        this.getStudentBalance()

    }

    getStudentBalance(){
    axios.get(getIP()+'/students/balance/')
    .then(response => {
      this.setState({student_balance: response.data})
    })
    .catch(error => console.log(error))
    }
    //Retrieving the class name
    getClassStudents() {
        axios.get(getIP()+'/students/class_code/')
        .then(response => {
            this.setState({ classroom: response.data[0].class_code })
            this.getBanks(response.data[0].class_code)
            this.getClassroomDetails()
            axios.get(getIP()+'/students/current/')
              .then(response => {
                this.setState({loggedin_student: response.data}, () => {this.getStudentSavings()})
              })
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
          }
        }
    }
    
    //Getting the inrest rate

    getBanks(class_code){
        axios.get(getIP()+'/banks/')
        .then(response => {
          this.setState({banks: response.data})
          this.getBankDetails(response.data, class_code)
        })
        .catch(error => console.log(error))
      }
    
      getBankDetails(banks, class_code){
        for (let i = 0; i<=banks.length -1;i++)
        {
          if(banks[i].class_code === class_code)
          {
            this.setState({interest_rate:banks[i].interest_rate})
            this.setState({payout_rate:banks[i].payout_rate})
          }
        }
      }

      //Insert Savings
      setStudentSavings(){
          axios.post(getIP()+'/transactions/banksavings/', {"amount": this.state.value, "done": false})
          .then(response => {
            var transaction_id = response.data["id"]
            axios.post(getIP()+'/transactioninterestrates/', {"class_code": this.state.classroom, "transaction_id": transaction_id})
            .then(response => {
              axios.get(getIP()+'/students/bank/')
              .then(response => {
                axios.put(getIP()+'/students/balance/', { amount: this.state.value, user_id: response.data, recipient: false })
                .then(response => {
                  this.setState({show:false})
                  this.getStudentSavings()
                })
                .catch(error => console.log(error))
              })
              .catch(error => console.log(error))
            })
            .catch(error => console.log(error))
          })
          .catch(error => console.log(error))
      }
      //Start Saving Modal
      openModal(){
        this.setState({show:true})
      }

      closeModal(){
        this.setState({show:false})
      }



      renderModal(){
          return(
            <Modal
            show={this.state.show}
            backdrop="static"
            keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>Start Saving</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        
                        <Form.Control onChange={e => this.setState({value: e.target.value})} type="number" placeholder="Enter the amount to save" />
                    </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.closeModal()}>Cancel</Button>
                    <Button variant="primary" className='bank-button' onClick={() => this.setStudentSavings()}>Confirm Saving</Button>
                </Modal.Footer>
            </Modal>
        )
      }


      //Get Savings
      getStudentSavings(){
        this.setState({savings: []})
        axios.get(getIP()+'/transactioninterestrates/')
        .then(response1 => {
            for(let i = 0; i <= response1.data.length-1; i++)
            {
                axios.get(getIP()+'/transactions/' + response1.data[i].transaction_id)
                .then(response2 => {
                    var initamount = parseFloat(response2.data.amount)
                    if(this.state.loggedin_student.id === response2.data.sender_id)
                    {
                        var intrate = parseFloat(response1.data[i].set_interest_rate)
                        var finalamount = initamount + (initamount*(intrate/100))
                        axios.get(getIP()+'/transactioninterestrates/payoutdate/' + response2.data.id)
                        .then(response => {
                          var payout_date = (((response.data / 60) / 60) / 24)
                          var tempdict = {
                            "id": i, 
                            "initial_amount": initamount, 
                            "interest_rate": intrate, 
                            "final_amount": finalamount, 
                            "transaction_id": response2.data.id, 
                            "payout_date": payout_date, 
                            "active": response1.data[i].active
                          }
                          this.setState({savings: [...this.state.savings, tempdict]})
                        })
                        .catch(error => console.log(error))
                    }
                })
                .catch(error => console.log(error))
            }
        })
        .catch(error => console.log(error))
      }

      renderSavings(item){
        if(item.active === true)
    {
        return(
          <Card style={{ width: '15rem' }} className='cards'>
              <Card.Body>
                  <Card.Title>Amount: {item.initial_amount}</Card.Title>
                  <Card.Text>
                      Payout of {item.final_amount}$ in {item.payout_date} days
                  </Card.Text>
                  <Button variant="primary" className='bank-button' onClick={() => this.claimSavings(item)}>Claim Savings</Button>
              </Card.Body>
          </Card>
      )
      }
    }
        claimSavings(item){
          
          if(item.payout_date === 0)
          {
            console.log(item)
            axios.post(getIP()+'/transactions/banksavings/', {"amount": Math.round(item.final_amount * 10) / 10, "done": true})
            .then(response => {
              console.log(response.data)
              axios.put(getIP()+'/transactioninterestrates/', {active: false, class_code: this.state.classroom, transaction_id: item.transaction_id})
              .then(response => {
                console.log(response.data)
                axios.get(getIP()+'/students/bank/')
                .then(response => {
                  axios.put(getIP()+'/students/balance/', { amount: (Math.round(item.final_amount * 10) / 10).toString(), user_id: response.data, recipient: true })
                  .then(response => {
                    console.log(response.data)
                    this.getStudentSavings()
                  })
                  .catch(error => console.log(error))
                })
                .catch(error => console.log(error))
              })
              .catch(error => console.log(error))
            })
            .catch(error => console.log(error))
          }
        }

    render(){
        return(
        <div className='wrapper'>
            <NavBar/>
            <div className='bank-content'>
            <div>
                <div className='bank-title'>
                  <div className='title-bank'><h3>Bank of {this.state.class_name}</h3></div>
                  <div className='title-balance'><h3>${this.state.student_balance}</h3></div>
                </div>

                <div className='bank-title'>
                  <div className='title-bank'><h6>Current Intrest Rate: {this.state.interest_rate} %</h6>
                <h6>Current Payout Rate: {this.state.payout_rate} week</h6>
                <h6>Current Balance: {this.state.student_balance}$</h6></div>
                  <div className='title-balance'><h3><Button className='bank-button' onClick={() => this.openModal()}>
                  Start Saving
                </Button></h3></div>
                </div>
                
                
                
                
                {this.renderModal()}
            </div>
            <div className='con'>
                <h2>My Savings</h2>
                <div className="savings_cards">
                    <div className='bank-cards'>
                        <Row xs="auto" md={2} className='override'>
                    {this.state.savings.map(item => {
                            return(this.renderSavings(item))
                        })}
                        </Row>
                      </div>
                </div>
            </div>
            </div>
        </div>
        )
    }

}

export default withRouter(StudentBank)