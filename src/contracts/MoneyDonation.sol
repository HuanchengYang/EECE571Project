pragma solidity ^0.5.0;

contract MoneyDonation {
    address public creator;
    string private donationCampaignName;
    string private description;
    uint public requiredAmount = 0;
    uint public donatedAmount = 0;
    uint public spentAmount = 0;
    uint public remainingBalance = 0;
    uint public totalDonator = 0;
    uint public totalExpense = 0;

    struct Donation {
        uint donationID;
        string donatorName;
        string donationMessage;
        uint donationAmount;
        address payable donatorAddress;
        bool isCompleted;
    }

    struct Expense {
        uint expenseID;
        uint spentAmount;
        address payable vendor;
        string extraInfo;
        bool isApproved;
    }

    mapping(uint => Donation) public donationList;
    mapping(uint => Expense) public expenseList;

    event MoneyDonated(
        string donatorName,
        uint donationAmount,
        string donationMessage,
        address donatorAddress,
        uint requiredAmount
    );

    event MoneySpent(
        uint spentAmount,
        address payable vendor,
        string extraInfo,
        bool isApproved
    );

    constructor(string memory _donationCampaignName,string memory _Description,uint _requiredAmount) public {
        donationCampaignName = _donationCampaignName;
        description = _Description;
        requiredAmount = _requiredAmount;
        creator = msg.sender;
    }

    function updateDescription(string memory _Description) public returns (bool) {
        description = _Description;
        return true;
    }

    function updateRequiredAmount(uint _requiredAmount) public returns (bool) {
        requiredAmount = _requiredAmount;
        return true;
    }

    function getRequiredAmount() public view returns (uint)  {
        return requiredAmount;
    }

    function getCampaignName() public view returns (string memory)  {
        return donationCampaignName;
    }

    function updateCampaignName(string memory _Name) public returns (bool) {
        donationCampaignName = _Name;
        return true;
    }

    function getCampaignDescription() public view returns (string memory) {
        return description;
    }

    function donateMoney(uint amount,string memory _Message,string memory _DonatorName) public payable {
        require(amount > 0, "Item's price is required!");
        require(msg.value >= amount, "Payment should be enough!");
        totalDonator++;
        donationList[totalDonator] = Donation(totalDonator,_DonatorName,_Message,amount,msg.sender,true);
        donatedAmount = donatedAmount+amount;
        requiredAmount = requiredAmount-amount;
        remainingBalance = remainingBalance+amount;
        emit MoneyDonated(_DonatorName,amount,_Message,msg.sender,requiredAmount);
    }

    function spendMoney(uint _amount,address payable _vendor,string memory _description) public {
        require(_amount > 0, "Amount Spent is required!");
        require(msg.sender == creator, "Only contract creator can spend money");

        totalExpense++;
        expenseList[totalExpense] = Expense(totalExpense,_amount,_vendor,_description, false);
        emit MoneySpent(_amount,_vendor,_description,false);
    }

    function approveSpending(uint expenseID) public payable{
        Expense memory expense = expenseList[expenseID];
        expense.isApproved = true;
        expenseList[expenseID]=expense;
        address payable _vendor = expense.vendor;
        _vendor.transfer(expense.spentAmount);
        spentAmount = spentAmount+expense.spentAmount;
        remainingBalance = remainingBalance - expense.spentAmount;
        emit MoneySpent(expense.spentAmount,_vendor,expense.extraInfo,true);
    }
}