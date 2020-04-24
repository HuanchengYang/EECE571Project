import React, { Component } from 'react';
class Donee extends Component {
  constructor(props) {
    super(props);
    this.state = { donationAmount: 0 };
  }
  myChangeHandler = (event) => {
    this.setState({donationAmount: event.target.value});
  }

  render() {
    return(
        <div class='donee' flex-md-nowrap p-0>
            <h1>donee</h1>
        </div>
        
    )
  }
}

export default Donee;
