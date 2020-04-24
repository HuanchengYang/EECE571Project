const EthDonation = artifacts.require("EthDonation");
const MoneyDonationPlatform = artifacts.require("MoneyDonationPlatform");

module.exports = function(deployer) {
    deployer.deploy(EthDonation);
    deployer.deploy(MoneyDonationPlatform);
};