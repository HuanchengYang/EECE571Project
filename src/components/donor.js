import React, { Component } from 'react';

class Donor extends Component {
  constructor(props) {
    super(props);
    this.state = { donationAmount: 0 };
  }
  myChangeHandler = (event) => {
    this.setState({donationAmount: event.target.value});
  }

  render() {
    return(
        <div class='donor ' >
            <h1>donor</h1>
            
        </div>
        
    )
  }
}

export default Donor;
