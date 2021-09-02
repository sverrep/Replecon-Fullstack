import React, { Component } from 'react';
import {MenuItems} from "./MenuItems"
import './Navbar.css'
import { withRouter, Redirect } from "react-router-dom";
class NavBar extends Component {
    state = { clicked: false }

    handleClick = () =>{
        this.setState({clicked: !this.state.clicked, redirect:'', targetClicked: false})
    }

    handleTarget(item){
        this.setState({redirect: item.url})
        this.setState({targetClicked: true})
    }

    render(){

        if(this.state.targetClicked===true){
            this.setState({targetClicked: false})
            return(
                <Redirect to={{pathname: this.state.redirect}}></Redirect>
            )
        }
        else{
        return(
            <nav className='NavbarItems'>
                <h1 className='navbar-logo'>Replecon</h1>
                <div className='menu-icon' onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
                <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
                    {MenuItems.map((item, index)=>{
                        return(
                            <li key={index}><a className={item.cName} onClick={() => this.handleTarget(item)}>{item.title}</a></li>
                        )
                    })}

                    
                </ul>
            </nav>
        )
    }
}
}

export default NavBar