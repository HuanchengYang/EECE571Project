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

            <h2>Add Item</h2>
        <form onSubmit = 
          {
            async (event) => {
            event.preventDefault();
            const itemName = this.itemName.value
            const amount = this.amount.value;
            await this.props.createItem(itemName, amount)}
          }>
            
        <div className="form-group mr-sm-2">
            <input 
            id="itemName"
            type="text"
            ref={(input)=>{this.itemName=input}}
            className="form-control"
            placeholder="Item Name"
            required/>
        </div>
        

        <div className="form-group mr-sm-2">
            <input 
            id="amount"
            type="number"
            ref={(input)=>{this.amount=input}}
            className="form-control"
            placeholder="Amount Required"
            required/>
        </div>
        <button type="submit" className="btn btn-primary">Add Item</button>
        </form>
        <p>&nbsp;</p>
        <h2>Receive Item</h2>
        <form onSubmit = 
          {async (event) => {
            event.preventDefault();
            const donateNo = this.donateNo.value
            await this.props.receiveItem(donateNo)}
          }>
            
        <div className="form-group mr-sm-2">
            <input 
            id="donateNo"
            type="number"
            ref={(input)=>{this.donateNo=input}}
            className="form-control"
            placeholder="Donate No."
            required/>
        </div>

        <button type="submit" className="btn btn-primary">Confirm</button>
        </form>

        <p>&nbsp;</p>
        <h2>End Donation</h2>
        <form onSubmit = 
          {async (event) => {
            event.preventDefault();
            const serialNo = this.serialNo.value
            await this.props.endDonation(serialNo)}
          }>
            
        <div className="form-group mr-sm-2">
            <input 
            id="serialNo"
            type="number"
            ref={(input)=>{this.serialNo=input}}
            className="form-control"
            placeholder="Serial No."
            required/>
        </div>
        

        <button type="submit" className="btn btn-primary">Confirm</button>
        </form>

        <p>&nbsp;</p>
        <h2>List of Donation</h2>
        <table className="table">
          
        <thead id="itemList">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Item Name</th>
            <th scope="col">Required Amount</th>
            <th scope="col">Received Amount</th>
            <th scope="col">Claimed Amount</th>
            <th scope="col">Transporting Amount</th>
            <th scope="col">Donee Address</th>
           
          </tr> 
        </thead>
        <tbody id="itemList">
          
            {this.props.items.map((item, key)=>{
                return(
                    <tr key={key}>
                    <th scope="row">{item.serialNo.toString()}</th>   
                    <td>{item.itemName}</td> 
                    <td>{item.amount.toString()} </td>
                    <td>{item.received.toString()}</td>
                    <td>{item.claimed.toString()}</td>
                    <td>{item.transporting.toString()}</td>
                    <td>{item.donee}</td>
                   
                  </tr>
                

                )
            })}
        </tbody>
        </table>
        </div>
        
    )
  }
}

export default Donee;
