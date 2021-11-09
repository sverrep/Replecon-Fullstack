import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {Link} from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import './TeacherNavbar.css';


export default function navbar(htext, current_class, teacher_id, token){
    var payload = {class: current_class, teacher_id: teacher_id, token: token}
    return(
        <Navbar collapseOnSelect expand="lg" className="teacher-navbar" variant="dark">
        <Container>
            <Navbar.Brand className="navbar-header">{htext}</Navbar.Brand>
            <Nav className="navbar-btns">
                <Button variant="light" className="navbar-btn"><Link className="navbar-link" to={{pathname: `/Class/${current_class.class_code}/students`, state: payload}}>Students</Link></Button>
                <Button variant="light" className="navbar-btn"><Link className="navbar-link" to={{pathname: `/Class/${current_class.class_code}/taxes`, state: payload}}>Taxes</Link></Button>
                <Button variant="light" className="navbar-btn"><Link className="navbar-link" to={{pathname: `/Class/${current_class.class_code}/store`, state: payload}}>Store</Link></Button>
                <Button variant="light" className="navbar-btn"><Link className="navbar-link" to={{pathname: `/Class/${current_class.class_code}/bank`, state: payload}}>Bank</Link></Button>
                <Button variant="secondary-outline" className="navbar-btn-class-list"><Link className="navbar-link" to={{pathname: `/Profile/`, state: {role: "Teacher", token: token}}}>Class List</Link></Button>
            </Nav>
        </Container>
        </Navbar>
    );
}