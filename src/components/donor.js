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
            

        <h2>Update Tracking No.</h2>
        <form onSubmit = 
          {async (event) => {
            event.preventDefault();
            const donateNo = this.donateNo.value
            const trackingNo = this.trackingNo.value;
            await this.props.transportItem(donateNo, trackingNo)}
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
        

        <div className="form-group mr-sm-2">
            <input 
            id="trackingNo"
            type="text"
            ref={(input)=>{this.trackingNo=input}}
            className="form-control"
            placeholder="tracking No"
            required/>
        </div>
        <button type="submit" className="btn btn-primary">Confirm</button>
        </form>
        <p>&nbsp;</p>
        <h2>Cancel Donation</h2>
        <form onSubmit = 
          {async (event) => {
            event.preventDefault();
            const donateNo = this.donateNo.value
            await this.props.cancelDonation(donateNo)}
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
        <h2>List of Donation</h2>
        <table className="table">
          
        <thead className="donationList">
          <tr>
            <th scope="col">donation #</th>
            <th scope="col">serial #</th>
            <th scope="col">item name</th>
            <th scope="col">donor address</th>
            <th scope="col">donation amount</th>
            <th scope="col">tracking #</th>
            <th scope="col">status</th>
          </tr> 
        </thead>
        <tbody className="contractList">
          {
            this.props.donations.map((donation, key)=>{
              let status
              if( donation.status == 0){
                status = 'claimed'
              }
              else if(donation.status == 1){
                status = 'transporting'
              }
              else if(donation.status == 2){
                status = 'received'
              }
              else if(donation.status == 3){
                status = 'cancelled due to overtime'
              }
              else if(donation.status == 4){
                status = 'cancelled by donor'
              }

              return(
                  <tr key={key}>
                  <th scope="row">{donation.donateNo.toString()}</th>
                  <th scope="row">{donation.serialNo.toString()}</th>   
                  <td>{donation.itemName}</td> 
                  <td>{donation.donor}</td> 
                  <td>{donation.amount.toString()} </td>
                  <td>{donation.trackingNo}</td>
                  <td>{status}</td>
                 
                </tr>
              

              )
          })
            
          }
        </tbody>
        </table>




        <p>&nbsp;</p>
        <h2>Donate Item</h2>
        <table className="table">
          
        <thead className="itemList">
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
        <tbody className="itemList">
          
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
        

        
    )
  }
}

export default Donor;
