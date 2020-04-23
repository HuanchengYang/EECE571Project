const EthDonation = artifacts.require("EthDonation");

module.exports = function(deployer) {
    deployer.deploy(EthDonation);
};