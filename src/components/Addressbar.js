import React, { Component } from 'react';
import {Link} from "react-router-dom"

class Addressbar extends Component {
  render() {
    return (
    <nav className="navbar fixed-top flex-md-nowrap pa-4 shadow">
        <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-black"><span id="account">{"Your Address: " + this.props.account}</span></small>
            </li>
        </ul>
        <Link to="/">Home</Link>
        <Link to="/Donor">Donor</Link>
        <Link to="/Donee">Donee</Link>
        <Link to="/MoneyDonation">MoneyDonation</Link>

    </nav>
   
    );
  }
}

export default Addressbar;
