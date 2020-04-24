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

    uint totalCampaign;
    string public platformName;


  event subcontractcreate(
        address donee,
        address subcontract
    );

  // index of created contracts

  mapping(address => MoneyDonation) public campaigns;
  //mapping(uint => MoneyDonation) public trackcampaigns;
  MoneyDonation[] public trackcampaigns;

constructor() public {
        platformName = "Emergency Resources Donation Platform";
        totalCampaign = 0;
    }

  // deploy a new contract

  function newMoneyDonation(string memory _donationCampaignName,string memory _Description,uint _requiredAmount) public
  {
    require (campaigns[msg.sender] == MoneyDonation(0),"Campaign should not be initialized");
    MoneyDonation md = new MoneyDonation(_donationCampaignName,_Description,_requiredAmount);
    totalCampaign = totalCampaign+1;
    campaigns[msg.sender] = md;
    trackcampaigns.push(md);
    emit subcontractcreate(
      msg.sender,
      address(md)
    );
  }

  function getContract()public view returns(MoneyDonation){
    return (campaigns[msg.sender]);
  }

  function getContractByNumber(uint number)public view returns(MoneyDonation){
    return (trackcampaigns[number]);
  }



  function getNumofCampaigns() public view returns (uint){
    return trackcampaigns.length;
  }
}
