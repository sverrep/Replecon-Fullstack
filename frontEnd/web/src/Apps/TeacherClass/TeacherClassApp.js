import axios from 'axios';
import  React  from 'react';
import { Redirect, withRouter } from "react-router-dom";
import getIP from '../../settings.js';
import './TeacherClassApp.css';
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Modal from 'react-bootstrap/Modal'
import FloatingLabel from 'react-bootstrap/FloatingLabel'


class TeacherClassApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        class_code: this.props.location.state.class.class_code, 
        class_name: this.props.location.state.class.class_name,
        teacher_id:  this.props.location.state.teacher_id,
        students: [],
        selected: [],
        selected_name: "",
        selected_balance: "",
        selected_id: "",
        amount: '',
        bank_id: '',
        interest_rate: "",
        payout_rate: "",
        student_savings: [],
        banks: [],
        error: '',
        bank_error: '',
        classHasBank: false,
        redirect_profile: false,
        bankModalShow: false,
        updateBankModalShow: false,
    };
    this.handleProfileRedirect = this.handleProfileRedirect.bind(this)
    this.studentClicked = this.studentClicked.bind(this)
    this.renderStudents = this.renderStudents.bind(this)
    this.amountIsValid = this.amountIsValid.bind(this)
    this.changeSelected = this.changeSelected.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.createBankModal = this.createBankModal.bind(this)

  }

  componentDidMount(){
    this.getClassStudents()
    this.getBanks()
  }

  studentClicked(student){
    this.setState({selected_name: student.name})
    this.setState({selected_balance: student.balance})
    this.setState({selected_id: student.id})
    var select = false;
    var index = 0;
    for(let i = 0; i <= Object.keys(this.state.selected).length-1; i++)
    {
      if(student.id === this.state.selected[i])
      {
          select = true;
          index = i;
          break;
      }
    }
    if(select === true)
    {
      var temparray = this.state.selected
      temparray.splice(index, 1)
      this.setState({selected: temparray})
    }
    else
    {
      this.setState(prevState => ({selected: [...prevState.selected, student.id]}))
    }
}

  handleProfileRedirect(){
    this.setState({redirect_profile: true})
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
  
  renderStudents(student, x){
    var select = false;
      for(let i = 0; i <= Object.keys(this.state.selected).length-1; i++)
      {
        if(student.id === this.state.selected[i])
        {
          select = true;
          break;
        }
      }
      if (select === true)
      {
        return(
          <ListGroup.Item key={x} active action onClick={() => this.studentClicked(student)}>{student.name} {student.balance}</ListGroup.Item>
        )
      }
      else if (select === false)
      {
        return(
          <ListGroup.Item key={x} action onClick={() => this.studentClicked(student)}>{student.name} {student.balance}</ListGroup.Item>
        )
      }
    }

    renderStudentSavings(student, i){
      if(student.active === true)
      {
        return(
          <ListGroup.Item key={i}>{student.name}: {student.initial_amount} {'-->'}  {student.interest_rate}%  {'-->'}  ${student.final_amount} Pays out in: {student.payout_date}</ListGroup.Item>
        )
      }
    }

    handleChange(e) {
      const field = e.target.id
      this.setState({ [field] : e.target.value });
    }

    amountIsValid(amount){
      if(isNaN(amount)){
        this.setState({error: 'Make sure that amount is a number'})
        return false
      }
      else{
        if(Math.sign(amount) === 1){
            return true
        }
        else{
            this.setState({error: 'Make sure that amount is a positive number'})
            return false
        }
      }
  } 
  
  changeSelected(pay){
    var selected_amount = this.state.amount 
    if(this.amountIsValid(selected_amount)) {
      if(!pay) {
        selected_amount= "-" + this.state.amount
      }
      var selected = this.state.selected
      for(let i = 0; i <= Object.keys(selected).length-1; i++)
      {
        var payload = { user_id: selected[i], amount: selected_amount }; 
        axios.put(getIP()+'/students/balance/', payload)
        .then(response => {
            axios.post(getIP()+'/transactions/teacherPayStudents/', {"user_id": response.data.user, "amount": selected_amount})
            .then(response => {
              this.getClassStudents()
              this.setState({selected: []})
            })
            .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
      }
      this.setState({show:false})
    }
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
      <Col>
        <h4>Class Bank</h4>
        <h6>Interest Rate: {this.state.interest_rate}</h6>
        <h6>Payout Rate: {this.state.payout_rate}</h6>
        <ListGroup>
          {this.state.student_savings.map((student,i) => this.renderStudentSavings(student, i))}
        </ListGroup>
        <Button className="pay-btns" onClick={() => this.setState({updateBankModalShow: true})}>Update Bank Rates</Button>
        {this.updateBankModal()}
      </Col>
    )
  }

  hasNoBank(){
    return (
      <Button variant="primary" onClick={() => this.setState({bankModalShow: true})}>
        Create A Bank
      </Button>
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

  createNewBank(){
    console.log("yo")
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
          <FloatingLabel label="Bank Interest Rate" className="bank-input">
            <FormControl id='interest_rate' placeholder="Interest Rate" onChange={this.handleChange}/>
          </FloatingLabel>
          <FloatingLabel label="Bank Payout Rate in Weeks" className="bank-input">
            <FormControl id='payout_rate' placeholder="Payout Rate" onChange={this.handleChange} />
          </FloatingLabel>
          <p>{this.state.bank_error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bank-btn" onClick={() => this.createNewBank()}>Create Bank</Button>
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
          <FloatingLabel label="Bank Interest Rate" className="bank-input">
            <FormControl id='interest_rate' placeholder="Interest Rate" defaultValue={this.state.interest_rate} onChange={this.handleChange}/>
          </FloatingLabel>
          <FloatingLabel label="Bank Payout Rate in Weeks" className="bank-input">
            <FormControl id='payout_rate' placeholder="Payout Rate" defaultValue={this.state.payout_rate} onChange={this.handleChange} />
          </FloatingLabel>
          <p>{this.state.bank_error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bank-btn" onClick={() => this.updateBankRates()}>Update Bank</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    if(this.state.redirect_profile){
      return(
        <Redirect to={{
          pathname: '/Profile', 
          state: { role: "Teacher" }}}>
      </Redirect>
      )
    }
    else{
      return (
        <Container className="class-container">
          <Row className="header-row">
          <h3>Class: {this.state.class_name}</h3>
          </Row>
          <Row className="header-btn-row">
          <Button variant="outline-primary" className="back-btn" onClick={this.handleProfileRedirect}> Go Back</Button>
          </Row>
          <Row className="content-row">
            <Col>
            <h4>Students</h4>
                <ListGroup>
                  {this.state.students.map((student,i) => this.renderStudents(student, i))}
                </ListGroup>
                <InputGroup className="amount-input">
                  <InputGroup.Text>$</InputGroup.Text>
                  <FormControl defaultValue="0" id='amount' onChange={this.handleChange} />
                </InputGroup>
                <p>{this.state.error}</p>
                <Button className="pay-btns" onClick={() => this.changeSelected(true)}>Pay Selected Students</Button>
                <Button className="pay-btns" onClick={() => this.changeSelected(false)}>Charge Selected Students</Button>
            </Col>
            <Col xs={7}>
              <Row className="taxes-row">
                <p>Class Taxes</p>
              </Row>
              <Row className="store-row">
                <p>Class Store</p>
              </Row>
              <Row className="bank-row">
                {this.renderBankView()}
                {this.createBankModal()}
              </Row>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}


export default withRouter(TeacherClassApp)
