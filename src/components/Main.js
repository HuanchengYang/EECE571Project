import React, { Component } from 'react';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { donationAmount: 0 };
  }
  myChangeHandler = (event) => {
    this.setState({donationAmount: event.target.value});
  }

  render() {
    return (
      <div id="content " >

        <h2>Add Item</h2>
        <form onSubmit = 
          {async (event) => {
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
        <h2>donation record</h2>
            <form onSubmit = 
          {async (event) => {
            event.preventDefault();
            const donateNo = this.listDonateNo.value
            await this.props.transportItem(donateNo)}
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
        <h2>Donate Item</h2>
        <table className="table">
          
        <thead id="itemList">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Item Name</th>
            <th scope="col">Required Amount</th>
            <th scope="col">claimed Amount</th>
            <th scope="col">Transporting Amount</th>
            <th scope="col">Owner Address</th>
            <th scope="col">Donate Amount</th>
            <th scope="col">Confirm Donation</th>
          </tr> 
        </thead>
        <tbody id="itemList">
          
            {this.props.items.map((item, key)=>{
                return(
                    <tr key={key}>
                    <th scope="row">{item.serialNo.toString()}</th>   
                    <td>{item.itemName}</td> 
                    <td>{item.amount.toString()} </td>
                    <td>{item.claimed.toString()}</td>
                    <td>{item.transporting.toString()}</td>
                    <td>{item.donee}</td>
                    <td>{
                      item.isAcceptable
                      ?
            <input 
            class= "donation"
            type="number"
            ref={(input)=>{this.quantity=input}}
            placeholder="Donate Quantity"
            onChange={this.myChangeHandler}
            required/>
        : 
                      <input type="number" id="quantity" name="quantity" disabled="disabled"/>
                      }
                      </td>
                    <td>
                      {
                        item.isAcceptable
                          ?
                          
                          <form id="donate"
                          onSubmit = 
                          {async (event) => {
                            event.preventDefault();
                            const itemName = item.serialNo;
                            const amount=this.state.donationAmount;
                            alert(amount);
                            await this.props.donateItem(itemName, amount)}
                          }>

                          <button type="submit" className="btn btn-primary">Donate Item</button>
                          </form>
                          : 
                          null
                        }
                    </td>
                  </tr>
                

                )
            })}
        </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
