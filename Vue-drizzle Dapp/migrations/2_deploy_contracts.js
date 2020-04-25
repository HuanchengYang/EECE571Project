const EthDonation = artifacts.require("EthDonation");
const MoneyDonation = artifacts.require('MoneyDonation')

module.exports = function(deployer) {
  deployer.deploy(EthDonation);
  deployer.deploy(MoneyDonation);
};
