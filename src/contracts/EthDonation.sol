pragma solidity ^0.5.16;

contract EthDonation {
    string public storeName;
    uint public sn = 0;
    uint public dn = 0;
    struct Item {
        uint serialNo;
        address donee;
        uint itemId;
        string itemName;
        uint initialRequired;
        uint amount;
        uint claimed;
        uint transporting;
        uint received;
        bool isAcceptable;
    }
    struct Donation {
        uint donateNo;
        address donor;
        uint serialNo;
        uint amount;
        string itemName;
        string trackingNo;
        uint status;    // 0--claimed, 1--transporting, 2--received, 3--overtime cancel due, 4--donor cancel
    }
    
    mapping(uint => Item) public items;
    mapping(address => uint[]) private donees;
    mapping(uint => Donation) public donations;
    mapping(address => uint[]) private donors;
    

    Item[] public itemRecord;
    Donation[] public donationRecord;


    event updateItem(
        uint serialNo,
        address donee,
        uint itemId,
        string itemName,
        uint amount,
        uint claimed,
        uint transporting,
        uint received,
        bool isAcceptable
    );
        
    event updateDonation(
        uint donateNo,
        address donor,
        uint serialNo,
        uint amount,
        string itemName,
        string trackingNo,
        uint status
    );

    constructor() public {
        storeName = "Emergency Resources Donation Platform";
    }



    function createItem(string memory _itemName, uint _amount) public {
        require(bytes(_itemName).length > 0, "Item's name is required");
        require(_amount > 0, "Item's amount is required");
        sn++;
        Item memory _item;
        _item.serialNo = sn;
        _item.donee = msg.sender;
        _item.itemId = 0;
        _item.itemName = _itemName;
        _item.initialRequired = _amount;
        _item.amount = _amount;
        _item.transporting = 0;
        _item.received = 0;
        _item.claimed = 0;
        _item.isAcceptable = true;
        items[sn] = _item;
        
        donees[msg.sender].push(sn);
        
        emit updateItem(
            _item.serialNo,
            _item.donee,
            _item.itemId,
            _item.itemName,
            _item.amount,
            _item.claimed,
            _item.transporting,
            _item.received,
            _item.isAcceptable
        );
    }

    function donateItem(uint _serialNo,  uint _amount) public {
        Item memory _item = items[_serialNo];
        require(_item.serialNo > 0 && _item.serialNo <= sn, 'Item should be in donation');
        require(_amount > 0, "Item's amount is required");
        require(_item.transporting + _item.received +_item.claimed< _item.amount, 'Item is enough temporarily');
        require(_item.isAcceptable, 'This donation is end');
        require(msg.sender != _item.donee, 'cannot donate to the same address');
        dn++;
        Donation memory _donation;
        _donation.donateNo = dn;
        _donation.donor = msg.sender;
        _donation.serialNo = _serialNo;
        
        if(_item.amount - _item.transporting - _item.received - _item.claimed>  _amount) _donation.amount = _amount;
        else _donation.amount = _item.amount - _item.transporting - _item.received-_item.claimed;
        _donation.itemName = _item.itemName;
        _donation.trackingNo = '';
        _donation.status = 0;
        donations[dn] = _donation;
        
        donors[msg.sender].push(dn);

        items[_serialNo].claimed += _donation.amount;
        items[_serialNo].amount -= _donation.amount;

        //Trigger an event
        emit updateItem(
            _item.serialNo,
            _item.donee,
            _item.itemId,
            _item.itemName,
            _item.amount,
            _item.claimed,
            _item.transporting,
            _item.received,
            _item.isAcceptable
        );

        emit updateDonation(
            _donation.donateNo,
            _donation.donor,
            _donation.serialNo,
            _donation.amount,
            _donation.itemName,
            _donation.trackingNo,
            _donation.status
        );

    }
    
    function transportItem(uint _donateNo, string memory _trackingNo) public {
        require(_donateNo > 0 && _donateNo <= dn, 'donation not exsit');
        require(donations[_donateNo].status == 0, 'item should been confirm');
        uint _serialNo = donations[_donateNo].serialNo;
        
        require(_serialNo > 0 && _serialNo <= sn, 'Item should be in donation');
        require(items[_serialNo].serialNo == _serialNo, 'serialNo not match');
        require(msg.sender == donations[_donateNo].donor, 'should be signed by donee');

        donations[_donateNo].status = 1;
        donations[_donateNo].trackingNo = _trackingNo;
        items[_serialNo].transporting += donations[_donateNo].amount;
        if(items[_serialNo].received+ items[_serialNo].transporting >= items[_serialNo].initialRequired) items[_serialNo].isAcceptable = false;
        //Trigger an event
        emit updateDonation(
            donations[_donateNo].donateNo,
            donations[_donateNo].donor,
            donations[_donateNo].serialNo,
            donations[_donateNo].amount,
            donations[_donateNo].itemName,
            donations[_donateNo].trackingNo,
            donations[_donateNo].status
        );
    }

    function receiveItem(uint _donateNo) public {
        require(_donateNo > 0 && _donateNo <= dn, 'donation not exsit');
        require(donations[_donateNo].status == 1, 'item should been tranporting');
        uint _serialNo = donations[_donateNo].serialNo;
        
        require(_serialNo > 0 && _serialNo <= sn, 'Item should be in donation');
        require(items[_serialNo].serialNo == _serialNo, 'serialNo not match');
        require(msg.sender == items[_serialNo].donee, 'should be signed by donee');

        donations[_donateNo].status = 2;
        items[_serialNo].transporting -= donations[_donateNo].amount;
        items[_serialNo].received += donations[_donateNo].amount;
        if(items[_serialNo].received+ items[_serialNo].transporting >= items[_serialNo].initialRequired) items[_serialNo].isAcceptable = false;
        //Trigger an event
        emit updateDonation(
            donations[_donateNo].donateNo,
            donations[_donateNo].donor,
            donations[_donateNo].serialNo,
            donations[_donateNo].amount,
            donations[_donateNo].itemName,
            donations[_donateNo].trackingNo,
            donations[_donateNo].status
        );

        emit updateItem(
            items[_serialNo].serialNo,
            items[_serialNo].donee,
            items[_serialNo].itemId,
            items[_serialNo].itemName,
            items[_serialNo].amount,
            items[_serialNo].claimed,
            items[_serialNo].transporting,
            items[_serialNo].received,
            items[_serialNo].isAcceptable
        );

        itemRecord.push(items[_serialNo]);
        donationRecord.push(donations[_donateNo]);


    }

    function cancelDonation(uint _donateNo) public {
        require(_donateNo > 0 && _donateNo <= dn, 'donation not exsit');
        require(donations[_donateNo].status == 0, 'item cannot cancel if shipped');
        uint _serialNo = donations[_donateNo].serialNo;
        
        require(_serialNo > 0 && _serialNo <= sn, 'Item should be in donation');
        require(items[_serialNo].serialNo == _serialNo, 'serialNo not match');
        require(msg.sender == donations[_donateNo].donor, 'should be cancelled by oneself');

        donations[_donateNo].status = 4;
        items[_serialNo].claimed -= donations[_donateNo].amount;
    
        
        //Trigger an event
        emit updateDonation(
            donations[_donateNo].donateNo,
            donations[_donateNo].donor,
            donations[_donateNo].serialNo,
            donations[_donateNo].amount,
            donations[_donateNo].itemName,
            donations[_donateNo].trackingNo,
            donations[_donateNo].status
        );
        emit updateItem(
            items[_serialNo].serialNo,
            items[_serialNo].donee,
            items[_serialNo].itemId,
            items[_serialNo].itemName,
            items[_serialNo].amount,
            items[_serialNo].claimed,
            items[_serialNo].transporting,
            items[_serialNo].received,
            items[_serialNo].isAcceptable
        );

    }
    
    function endDonation(uint _serialNo) public {
        Item memory _item = items[_serialNo];
        require(_item.serialNo > 0 && _item.serialNo <= sn, 'Item should be in donation');
        require(_item.isAcceptable, 'This donation is end');
        require(msg.sender == items[_serialNo].donee, 'only end donation by oneself');

        items[_serialNo].isAcceptable = false;
       
        //Trigger an event
        emit updateItem(
            items[_serialNo].serialNo,
            items[_serialNo].donee,
            items[_serialNo].itemId,
            items[_serialNo].itemName,
            items[_serialNo].amount,
            items[_serialNo].claimed,
            items[_serialNo].transporting,
            items[_serialNo].received,
            items[_serialNo].isAcceptable
        );

    }

    
    function listSerialNo(address _donee) public view returns (uint[] memory) {
        return donees[_donee];
    }

    function listDonateNo(address _donor) public view returns (uint[] memory) {
        return donors[_donor];
    }
    // function itemRecords() public view returns() {
    //     return itemRecord;
    // }
    function doneeRecord(uint _serialNo) public view returns (uint serialNo, string memory itemName, uint amount, uint transporting, uint received, bool isAcceptable) {
        require(_serialNo > 0 && _serialNo <= sn, 'Item should be in donation');
        string memory _itemName;
        uint _amount;
        uint _transporting;
        uint _received;
        bool _isAcceptable;
        require(_serialNo ==  items[_serialNo].serialNo, 'Item sn not match');
        _itemName = items[_serialNo].itemName;
        _amount = items[_serialNo].amount;
        _transporting = items[_serialNo].transporting;
        _received = items[_serialNo].received;
        _isAcceptable = items[_serialNo].isAcceptable;
        //return Item[_serialNo];
        return (_serialNo, _itemName, _amount, _transporting, _received, _isAcceptable);
    }
    // function donationRecords() public view{
    //     return donationRecord;
    // }
    
    function donorRecord(uint _donateNo) public view returns (uint donateNo, uint serialNo, string memory itemName, uint amount, uint status) {
        require(_donateNo > 0 && _donateNo <= dn, 'donation num out of range');
        uint _serialNo;
        string memory _itemName;
        uint _amount;
        uint _status;
        require(_donateNo == donations[_donateNo].donateNo, 'donation sn not match');
        _serialNo = donations[_donateNo].serialNo;
        _itemName = donations[_donateNo].itemName;
        _amount = donations[_donateNo].amount;
        _status = donations[_donateNo].status;
        return (_donateNo, _serialNo, _itemName,_amount, _status);
    }
}