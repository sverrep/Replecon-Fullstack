import React, { Component } from 'react';
import {MenuItems} from "./MenuItems"
import './Navbar.css'
import { Redirect } from "react-router-dom";
import Button from 'react-bootstrap/Button';
class NavBar extends Component {
    state = { 
        clicked: false,
        current_click: '',
    
    }

    handleClick = () =>{
        this.setState({clicked: !this.state.clicked, redirect:'', targetClicked: false})
    }

    handleTarget(item){
        this.setState({redirect: item.url})
        this.setState({targetClicked: true})
        this.setState({current_click:item.url})
    }

    render(){

        if(this.state.targetClicked===true){
            this.setState({targetClicked: false})
            if(this.state.redirect==='/Profile'){
                return(
                    <Redirect to={{pathname: this.state.redirect, state: {role: "Student"}}}></Redirect>
                )
            }
            else{
                return(
                    <Redirect to={{pathname: this.state.redirect}}></Redirect>
                )
            }
            
            
        }
        else{
        return(
            <nav className='NavbarItems'>
                <h1 className='navbar-logo'>Replecon</h1>
                <div className='menu-icon' onClick={() => this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
                <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
                    {MenuItems.map((item, index)=>{
                        if(window.location.href.includes(item.url)){
                            return(
                                <li key={index}><Button variant="secondary" className='but-sd'  onClick={() => this.handleTarget(item)}>{item.title}</Button></li>
                            )
                        }

                        else{
                            return(
                                <li key={index}><Button variant="light" className='but-sd'  onClick={() => this.handleTarget(item)}>{item.title}</Button></li>
                            )
                        }
                        
                        
                    })}

                    
                </ul>
            </nav>
        )
    }
}
}

export default NavBar