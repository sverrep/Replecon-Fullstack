import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {Link} from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import './TeacherNavbar.css';


export default function navbar(htext, current_class, teacher_id){
    return(
        <Navbar collapseOnSelect expand="lg" className="teacher-navbar" variant="dark">
        <Container>
            <Navbar.Brand className="navbar-header">{htext}</Navbar.Brand>
            <Nav className="navbar-btns">
                <Button variant="secondary" className="navbar-btn-current"><Link className="navbar-link-current" to={{pathname: `/Class/${current_class.class_code}/students`, state: {class: current_class, teacher_id: teacher_id}}}>Students</Link></Button>
                <Button variant="light" className="navbar-btn"><Link className="navbar-link" to={{pathname: `/Class/${current_class.class_code}/features`, state: {class: current_class, teacher_id: teacher_id}}}>Taxes</Link></Button>
                <Button variant="light" className="navbar-btn"><Link className="navbar-link" to={{pathname: `/Class/${current_class.class_code}/features`, state: {class: current_class, teacher_id: teacher_id}}}>Store</Link></Button>
                <Button variant="light" className="navbar-btn"><Link className="navbar-link" to={{pathname: `/Class/${current_class.class_code}/features`, state: {class: current_class, teacher_id: teacher_id}}}>Bank</Link></Button>
                <Button variant="secondary-outline" className="navbar-btn-class-list"><Link className="navbar-link" to={{pathname: `/Profile/`, state: {role: "Teacher"}}}>Class List</Link></Button>
            </Nav>
        </Container>
        </Navbar>
    );
}