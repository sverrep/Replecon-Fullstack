import React from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import getIP from '../../settings.js';
import './TeacherStudents.css';
import navbar from '../../Components/navbar/Teacher NavBar/TeacherNavbar';
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'



class TeacherStudents extends React.Component {
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
            amount: "",
            display_items: [],
            all_items: [],
        };
        this.studentClicked = this.studentClicked.bind(this)
        this.renderStudents = this.renderStudents.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.amountIsValid = this.amountIsValid.bind(this)
    }

    componentDidMount(){
        this.getClassStudents()
        this.getAllItems()
    }

    getClassStudents() {
        axios.get(getIP()+'/students/')
        .then(response => {
          this.setState({students:response.data});
          this.getCurrentClassStudents(response.data)
        })
        .catch(error => console.log(error))
    }

    getAllItems(){
        axios.get(getIP()+'/items/')
        .then(async (response) => {
            this.setState({all_items: response.data})
        })
        .catch(error => console.log(error))
    }

    handleChange(e) {
        const field = e.target.id
        this.setState({ [field] : e.target.value });
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
          this.getBoughtItems()
        }
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
                <ListGroup.Item key={x} active action onClick={() => this.studentClicked(student)}>
                    <Row>
                        <Col>
                            {student.name}
                        </Col>
                        <Col  className="list-balance-col">
                            {"Balance: " + student.balance}
                        </Col>
                    </Row>
                </ListGroup.Item>
            )
        }
        else if (select === false)
        {
            return(
                <ListGroup.Item key={x} action onClick={() => this.studentClicked(student)}>
                    <Row>
                        <Col>
                            {student.name}
                        </Col>
                        <Col  className="list-balance-col">
                            {"Balance: " + student.balance}
                        </Col>
                    </Row>
                </ListGroup.Item>
            )
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

    getBoughtItems(){
        axios.get(getIP()+'/items/allboughtitems/')
        .then(response => {
            var all_bought_items = response.data.reverse()
            var temparray = []
            for(var i = 0; i < Object.keys(all_bought_items).length; i++)
            {
                for(var j = 0; j < Object.keys(this.state.selected).length; j++)
                {
                    
                    if (this.state.selected[j] === all_bought_items[i].user_id)
                    {
                        temparray.push(all_bought_items[i])
                    }
                }
            }
            this.setState({display_items: temparray})
        })
        .catch(error => console.log(error))
    }

    renderItems(item, x){
        var name = ""
        var item_name = ""
        var selected = false
        for(var i = 0; i < Object.keys(this.state.students).length; i++)
        {
            if(item.user_id === this.state.students[i].id)
            {
                name = this.state.students[i].name
            }
        }
        for (var j = 0; j < Object.keys(this.state.all_items).length; j++)
        {
            if(item.item_id === this.state.all_items[j].id)
            {
                item_name = this.state.all_items[j].item_name
            }
        }
        for (var k = 0; k < Object.keys(this.state.selected).length; k++)
        {
            if(item.user_id === this.state.selected[k])
            {
                selected = true
            }
        }
        if(selected === true)
        {
            return(
                <ListGroup.Item key={x}>
                    <Row>
                        <Col>
                            {item_name}
                        </Col>
                        <Col  className="list-balance-col">
                            {name}
                        </Col>
                    </Row>
                </ListGroup.Item>
            );
        }
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

    render(){
        return (
            <div className="wrapper">
                {navbar("Econ12", {class_code: this.state.class_code, class_name: this.state.class_name}, this.state.teacher_id)}
                <Container className="student-container">
                    <Row className="content-row">
                        <Col className="student-list-col">
                            <h4 className="student-header">Students</h4>
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
                        <Col>
                            <h4 className="student-header">Student Items</h4>
                            {this.state.display_items.map((item,i) => this.renderItems(item, i))}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default withRouter(TeacherStudents)