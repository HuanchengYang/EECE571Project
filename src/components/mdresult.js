import React, { Component } from 'react';

class MDresult extends Component {
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

        <h2>Create Contract</h2>
        <form onSubmit = 
          {async (event) => {
            event.preventDefault();
            const campaignName = this.campaignName.value;
            const campaignDescription = this.campaignDescription.value;
            const amount = this.amount.value;
            await this.props.createContract(campaignName,campaignDescription,amount)}
          }>
            
        <div className="form-group mr-sm-2">
            <input 
            id="campaignName"
            type="text"
            ref={(input)=>{this.campaignName=input}}
            className="form-control"
            placeholder="Campaign Name"
            required/>
        </div>

        <div className="form-group mr-sm-2">
            <input 
            id="campaignDescription"
            type="text"
            ref={(input)=>{this.campaignDescription=input}}
            className="form-control"
            placeholder="Campaign Description"
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
        <button type="submit" className="btn btn-primary">Create Contract</button>
        </form>


        <p>&nbsp;</p>
        <h2>List of Contract</h2>
        <table className="table">
          
        <thead id="contractList">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Campaign Name</th>
            <th scope="col">Campaign Description</th>
            <th scope="col">Required Amount</th>
            <th scope="col">Owner Address</th>
            <th scope="col">Donate Amount</th>
            <th scope="col">Confirm Donation</th>
          </tr> 
        </thead>
        <tbody id="contractList">
          
            {this.props.contracts.map((mdcontract, key)=>{
              let Name = mdcontract.methods.getCampaignName()
                return(
                    <tr key={key}>
                    <th scope="row">{mdcontract.options.address}</th>   
                    
                  </tr>
                

                )
            })}
        </tbody>
        </table>
      </div>
    );
  }
}

export default MDresult;
