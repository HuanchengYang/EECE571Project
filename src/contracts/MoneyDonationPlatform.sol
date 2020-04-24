pragma solidity ^0.5.0;

import "./MoneyDonation.sol";

contract MoneyDonationPlatform {
  struct Campaign {
        uint donationID;
        string donatorName;
        string donationMessage;
        uint donationAmount;
        address payable donatorAddress;
        bool isOpen;
    }

  event subcontractcreate(
        address donee,
        address subcontract
    );

  // index of created contracts

  mapping(address => MoneyDonation) public campaigns;


  // deploy a new contract

  function newMoneyDonation(string memory _donationCampaignName,string memory _Description,uint _requiredAmount) public
  {
    MoneyDonation md = new MoneyDonation(_donationCampaignName,_Description,_requiredAmount);
    campaigns[msg.sender] = md;
    emit subcontractcreate(
      msg.sender,
      address(md)
    );
  }

  function getContract()public view returns(MoneyDonation){
    return (campaigns[msg.sender]);
  }
}
