import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import MoneyDonationPlatform from '../abis/MoneyDonationPlatform'
import MoneyDonationContract from '../abis/MoneyDonation'
import Addressbar from './Addressbar'
import MDresult from './mdresult';


class MoneyDonation extends Component {
    state = {
        donationaddress: '',
        totalNumber: 0,
        contracts: [],
        loading: true,
        contractNum: 0
      }
    
      async componentDidMount() {
        await this.getWeb3Provider();
        await this.connectToBlockchain();
      }

  

      

      async getWeb3Provider() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
        } else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
        } else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
      }


      async connectToBlockchain() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const networkData = MoneyDonationPlatform.networks[networkId];
        if (networkData) {
          const deployedMoneyDonationPlatform = new web3.eth.Contract(MoneyDonationPlatform.abi, networkData.address);
          this.setState({ deployedMoneyDonationPlatform: deployedMoneyDonationPlatform });
          const contractNum = await deployedMoneyDonationPlatform.methods.getNumofCampaigns().call();
          console.log(contractNum);
          this.setState({ contractNum })
          for (var i = 0; i < contractNum; i++) {
             var contractaddress;
            try {
            contractaddress = await deployedMoneyDonationPlatform.methods.getContractByNumber(i).call({from: this.state.account});
            } catch(e){
              console.log(e);
            }
            console.log(contractaddress);
            const mdcontract = new web3.eth.Contract(MoneyDonationContract.abi, contractaddress);
            this.setState({
              contracts: [...this.state.contracts, mdcontract]
            });
          }
          this.setState({ loading: false })
          console.log(this.state.contracts)
        } else {
          window.alert('EthDonation contract is not found in your blockchain.')
        }
    
      }


    

      createContract = async (campaignName,campaignDescription,amount) => {
        const web3 = window.web3;
        this.setState({ loading: true })
        try {
        const gasAmount = await this.state.deployedMoneyDonationPlatform.methods.newMoneyDonation(campaignName,campaignDescription,web3.utils.toWei(amount)).estimateGas({ from: this.state.account })
        const result=await this.state.deployedMoneyDonationPlatform.methods.newMoneyDonation(campaignName,campaignDescription,web3.utils.toWei(amount)).send({ from: this.state.account, gas: gasAmount })
          .once('receipt', (receipt) => {
            // const serialNumber = this.state.deployedEthDonation.methods.sn().call();
            // const item = this.state.deployedEthDonation.methods.items(serialNumber).call();
            // // this.setState({
            // //   items: [...this.state.items, item]});  
                       
            this.setState({ loading: false });
            document.location.reload()
          })
          console.log(result);  
        }catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            error,
          );
          console.error(error);
          document.location.reload()
    
        } 
        
      }

      donateMoney = async (contract,donorName,donorMessage,amount) => {
        const web3 = window.web3;
        this.setState({ loading: true });
        console.log(contract);
        try {
        const gasAmount = await contract.methods.donateMoney(donorName,donorMessage,web3.utils.toWei(amount)).estimateGas({ from: this.state.account })
        const result=await contract.methods.donateMoney(donorName,donorMessage,web3.utils.toWei(amount)).send({ from: this.state.account, gas: gasAmount, value:amount })
          .once('receipt', (receipt) => {
            // const serialNumber = this.state.deployedEthDonation.methods.sn().call();
            // const item = this.state.deployedEthDonation.methods.items(serialNumber).call();
            // // this.setState({
            // //   items: [...this.state.items, item]});  
                       
            this.setState({ loading: false });
            document.location.reload()
          })
          console.log(result);  
        }catch (error) {
          // Catch any errors for any of the above operations.
          //alert(
            //error,
          //);
          console.error(error);
          //document.location.reload()
    
        } 
        
      }





  render() {
    return (
        <div>
          <Addressbar account={this.state.account} />
          <div className="container-fluid mt-5">
            <div className="row ">
              <main>
                {this.state.loading
                  ?
                  <div><p className="text-center">Loading ...</p></div>
                  :
                      <MDresult contracts={this.state.contracts}
                      totalcontract={this.state.contractNum}
                      createContract={this.createContract}
                      donateMoney={this.donateMoney}
                      />
                    
  
                }
                
  
              </main>
            </div>
          </div>
        </div>
      );
    }
  }


export default MoneyDonation;
