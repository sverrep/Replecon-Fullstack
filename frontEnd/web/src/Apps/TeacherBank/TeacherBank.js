import React from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import getIP from '../../settings.js';
import './TeacherBank.css';
import navbar from '../../Components/navbar/Teacher NavBar/TeacherNavbar';
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Modal from 'react-bootstrap/Modal'
import Card from 'react-bootstrap/Card'


class TeacherBank extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            class_code: this.props.location.state.class.class_code, 
            class_name: this.props.location.state.class.class_name,
            teacher_id:  this.props.location.state.teacher_id,
            students: [],

            bank_id: '',
            interest_rate: "",
            payout_rate: "",
            student_savings: [],
            banks: [],
            bank_error: '',
            classHasBank: false,
            bankModalShow: false,
            updateBankModalShow: false,
        };
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        const field = e.target.id
        this.setState({ [field] : e.target.value });
    }

    componentDidMount(){
        this.getClassStudents()
        this.getBanks()
    }

    getClassStudents() {
        axios.get(getIP()+'/students/')
        .then(response => {
          this.setState({students:response.data});
          this.getCurrentClassStudents(response.data)
        })
        .catch(error => console.log(error))
    }

    getCurrentClassStudents(students){
        var newAr = []
        for (let i = 0; i<=Object.keys(students).length -1;i++)
        {
            if(students[i].class_code===this.state.class_code)
            {
              newAr.push(students[i])
            }
        }
        this.setState({students:newAr})
    }

    getBanks(){
        axios.get(getIP()+'/banks/')
        .then(response => {
          this.setState({banks: response.data})
          this.checkForBank(response.data)
        })
        .catch(error => console.log(error))
    }

    checkForBank(banks){
        for(let i = 0; i <= Object.keys(banks).length - 1; i++){
          if(banks[i].class_code === this.state.class_code){
            this.setState({classHasBank:true})
            this.setState({bank_id: banks[i].id})
            this.setState({interest_rate: banks[i].interest_rate})
            this.setState({payout_rate: banks[i].payout_rate})
          }
        }
        this.getStudentSavings()
    }

    isStudentInClass(student_name){
        for (let i = 0; i<Object.keys(this.state.students).length;i++)
        {
          if(student_name === this.state.students[i].name)
          {
            return true
          }
        }
        return false
    }

    renderStudentSavings(student, i){
        if(student.active === true)
        {
          return(
            <ListGroup.Item className="bank-list-group" key={i}> 
                <Row>
                    <Col>
                        {student.name}
                    </Col>
                    <Col>
                        ${student.initial_amount} {'-->'}  {student.interest_rate}%  {'-->'}  ${student.final_amount}
                    </Col>
                    <Col  className="list-balance-col">
                        Pays out in: {student.payout_date}
                    </Col>
                </Row>
            </ListGroup.Item>
          )
        }
    }

    getStudentSavings(){
        axios.get(getIP()+'/transactioninterestrates/')
        .then(response1 => {
            for(let i = 0; i <= Object.keys(response1.data).length-1; i++)
            {
                axios.get(getIP()+'/transactions/' + response1.data[i].transaction_id)
                .then(response2 => {
                    var initamount = parseFloat(response2.data.amount)
                    axios.get(getIP()+'/users/' + response2.data.sender_id + '/')
                    .then(userresponse => {
                        if(this.isStudentInClass(userresponse.data.first_name))
                        {
                            var intrate = parseFloat(response1.data[i].set_interest_rate)
                            var finalamount = initamount + (initamount*(intrate/100))
                            axios.get(getIP()+'/transactioninterestrates/payoutdate/' + response2.data.id)
                            .then(response => {
                                var payout_date = (((response.data / 60) / 60) / 24)
                                var tempdict = {
                                    "id": i, 
                                    "name": userresponse.data.first_name, 
                                    "initial_amount": initamount, 
                                    "interest_rate": intrate, 
                                    "final_amount": finalamount, 
                                    "payout_date": payout_date,
                                    "active": response1.data[i].active
                                }
                                this.setState({student_savings: [...this.state.student_savings, tempdict]})
                            })
                            .catch(error => console.log(error))
                        }
                    })
                    .catch(error => console.log(error))
                })
                .catch(error => console.log(error))
            }
        })
        .catch(error => console.log(error))
    }

    hasBank(){
        return(
          <Col className="bank-col">
                <Row className="bank-row">
                    <h4>{this.state.class_name} Bank</h4>
                    <h6>Interest Rate: {this.state.interest_rate}%</h6>
                    <h6>Payout Rate: {this.state.payout_rate} Weeks</h6>
                    <Button className="bank-btns" onClick={() => this.setState({updateBankModalShow: true})}>Update Bank Rates</Button>
                </Row>
                <Row>
                    <h4 className="bank-header">Current Student Savings</h4>
                    <ListGroup className="small-group">
                        {this.state.student_savings.map((student,i) => this.renderStudentSavings(student, i))}
                    </ListGroup>
                </Row>
            {this.updateBankModal()}
          </Col>
        )
    }

    hasNoBank(){
        return (
          <Col className="bank-col">
            <h4>This class has no bank</h4>
            <Button className="bank-btns" onClick={() => this.setState({bankModalShow: true})}>
              Create A Bank
            </Button>
            {this.createBankModal()}
          </Col>
        );
    }

    renderBankView(){
        if(this.state.classHasBank === true)
        {
          return(
              this.hasBank()
          )
        }
    
        else{
          return(
              this.hasNoBank()
          )
        }
    }

    createNewBank(){
        if(this.validateBank())
        {
          axios.post(getIP()+'/banks/', {
            class_code: this.state.class_code,
            interest_rate: this.state.interest_rate,
            payout_rate: this.state.payout_rate,
          })
          .then(response => {
            this.setState({bankModalShow: false})
            this.getBanks()
          })
          .catch(error => console.log(error))
        }
    }
    
    updateBankRates(){
        if(this.validateBank())
         {
          axios.put(getIP()+'/banks/' + this.state.bank_id, {
            class_code: this.state.class_code,
            interest_rate: this.state.interest_rate,
            payout_rate: this.state.payout_rate,
          })
          .then(response => {
            this.setState({updateBankModalShow:false})
          })
          .catch(error => console.log(error))
        }
    }

    validateBank(){
        if(this.state.interest_rate !== '')
        {
          if(this.state.payout_rate !== '')
          {
            if(!isNaN(this.state.interest_rate))
            {
              if(parseFloat(this.state.interest_rate) > 0 && parseFloat(this.state.interest_rate) < 100)
              {
                if(!isNaN(this.state.payout_rate))
                {
                    return true
                }
                else
                {
                    this.setState({bank_error: "Please enter a number for payout rate"})
                }
              }
              else
              {
                  this.setState({bank_error: "Please enter a valid interest rate percentage"})
              }
            }
            else
            {
                this.setState({bank_error: "Please enter a valid interest rate"})
            }
          }
          else
          {
              this.setState({bank_error: "Please enter a payout rate"})
          }
        }
        else
        {
            this.setState({bank_error: "Please enter an interest rate"})
        }
    }

    createBankModal() {
        return (
          <Modal
            show={this.state.bankModalShow}
            onHide={() => this.setState({bankModalShow: false})}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Create A Bank
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FloatingLabel label="Bank Interest Rate" className="modal-input">
                <FormControl id='interest_rate' placeholder="Interest Rate" onChange={this.handleChange}/>
              </FloatingLabel>
              <FloatingLabel label="Bank Payout Rate in Weeks" className="modal-input">
                <FormControl id='payout_rate' placeholder="Payout Rate" onChange={this.handleChange} />
              </FloatingLabel>
              <p>{this.state.bank_error}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button className="bank-btns" onClick={() => this.createNewBank()}>Create Bank</Button>
            </Modal.Footer>
          </Modal>
        );
    }
    
    updateBankModal() {
        return (
          <Modal
            show={this.state.updateBankModalShow}
            onHide={() => this.setState({updateBankModalShow: false})}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Update Bank
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FloatingLabel label="Bank Interest Rate" className="modal-input">
                <FormControl id='interest_rate' placeholder="Interest Rate" defaultValue={this.state.interest_rate} onChange={this.handleChange}/>
              </FloatingLabel>
              <FloatingLabel label="Bank Payout Rate in Weeks" className="modal-input">
                <FormControl id='payout_rate' placeholder="Payout Rate" defaultValue={this.state.payout_rate} onChange={this.handleChange} />
              </FloatingLabel>
              <p>{this.state.bank_error}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button className="bank-btns" onClick={() => this.updateBankRates()}>Update Bank</Button>
            </Modal.Footer>
          </Modal>
        );
    }

    render(){
        return(
            <div className="wrapper">
                {navbar(this.state.class_name, {class_code: this.state.class_code, class_name: this.state.class_name}, this.state.teacher_id)}
                <Container className="bank-container">
                    <Row className="content-row">
                        {this.renderBankView()}
                    </Row>
                </Container>
            </div>
        );
    }
}

export default withRouter(TeacherBank)