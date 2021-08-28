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
        redirect_profile: false,
    };
    this.handleProfileRedirect = this.handleProfileRedirect.bind(this)
    this.studentClicked = this.studentClicked.bind(this)
    this.renderData = this.renderData.bind(this)

  }

  componentDidMount(){
    this.getClassStudents()
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
  
  renderData(student, x){
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
                  {this.state.students.map((student,i) => this.renderData(student, i))}
                </ListGroup>
                <InputGroup className="amount-input">
                  <InputGroup.Text>$</InputGroup.Text>
                  <FormControl aria-label="Amount (to the nearest dollar)" />
                </InputGroup>
                <Button className="pay-btns">Pay Selected Students</Button>
                <Button className="pay-btns">Charge Selected Students</Button>
            </Col>
            <Col xs={7}>
              <Row className="taxes-row"><p>Taxes</p></Row>
              <Row className="store-row"><p>Store</p></Row>
              <Row className="bank-row"><p>Bank</p></Row>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}



  export default withRouter(TeacherClassApp)
