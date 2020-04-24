import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import EthDonation from '../abis/EthDonation'
import Addressbar from './Addressbar'
import Main from './Main'
import { Route, Switch } from 'react-router-dom';
import Donor from './donor'
import Donee from './donee'
import MoneyDonation from './moneydonation'

class App extends Component {
  state = {
    doneeaccount: '',
    totalNumber: 0,
    items: [],
    loading: true
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
    const networkData = EthDonation.networks[networkId];
    if (networkData) {
      const deployedEthDonation = new web3.eth.Contract(EthDonation.abi, networkData.address);
      this.setState({ deployedEthDonation: deployedEthDonation });
      const serialNumber = await deployedEthDonation.methods.sn().call();
      console.log(serialNumber);
      this.setState({ serialNumber })
      for (var i = 1; i <= serialNumber; i++) {
        const item = await deployedEthDonation.methods.items(i).call();
        this.setState({
          items: [...this.state.items, item]
        });
      }
      this.setState({ loading: false })
      console.log(this.state.items)
    } else {
      window.alert('EthDonation contract is not found in your blockchain.')
    }

  }


  createItem = async (itemName, amount) => {
    this.setState({ loading: true })
    const gasAmount = await this.state.deployedEthDonation.methods.createItem(itemName, amount).estimateGas({ from: this.state.account })
    this.state.deployedEthDonation.methods.createItem(itemName, amount).send({ from: this.state.account, gas: gasAmount })
      .once('receipt', (receipt) => {
        // const serialNumber = this.state.deployedEthDonation.methods.sn().call();
        // const item = this.state.deployedEthDonation.methods.items(serialNumber).call();
        // // this.setState({
        // //   items: [...this.state.items, item]});                
        this.setState({ loading: false });
        document.location.reload()
      })
  }


  donateItem = async (itemId, amount) => {
    this.setState({ loading: true })
    try {
      const gasAmount = await this.state.deployedEthDonation.methods.donateItem(itemId, amount).estimateGas({ from: this.state.account })

      const receipt = this.state.deployedEthDonation.methods.donateItem(itemId, amount).send({ from: this.state.account })

        .on('receipt', (receipt) => {
          this.setState({ loading: false });
          document.location.reload()
        })
        .on('error', console.error);
    }
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error,
      );
      console.error(error);
      document.location.reload()

    }
  }

  createMoneyDonation







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
                <Switch>
                  <Route exact path="/">
                    <Main items={this.state.items}
                      createItem={this.createItem}
                      donateItem={this.donateItem}
                    />
                  </Route>
                  <div>

                    <Route path="/donor" component={Donor}>
                    </Route>

                    <Route path="/donee" component={Donee}>
                    </Route>
                    <Route path="/moneydonation" component={MoneyDonation}>
                    </Route>
                  </div>


                </Switch>

              }

            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;