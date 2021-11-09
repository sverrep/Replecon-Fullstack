import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {Link} from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import './Navbar.css'

export default function navbar(token){
    var payload = {role: "Student", token: token}
    return(
        <Navbar collapseOnSelect expand="lg" className="teacher-navbar" variant="dark">
        <Container>
            <Navbar.Brand className="navbar-header">Replecon</Navbar.Brand>
            <Nav className="navbar-btns">
                <Button variant="light" className="navbar-btn"><Link className="navbar-link" to={{pathname: `/Profile`, state: payload}}>Profile</Link></Button>
                <Button variant="light" className="navbar-btn"><Link className="navbar-link" to={{pathname: `/StudentStore`, state: payload}}>Store</Link></Button>
                <Button variant="light" className="navbar-btn"><Link className="navbar-link" to={{pathname: `/StudentBank`, state: payload}}>Bank</Link></Button>
                <Button variant="light" className="navbar-btn"><Link className="navbar-link" to={{pathname: `/StudentClass`, state: payload}}>Classroom</Link></Button>
            </Nav>
        </Container>
        </Navbar>
    );
}