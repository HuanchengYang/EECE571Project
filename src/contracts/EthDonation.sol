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
        uint amount;
        uint transporting;
        uint recieved;
        bool isAcceptable;
    }
    struct Donation {
        uint denoteNo;
        address doner;
        uint serialNo;
        uint amount;
        string itemName;
        string trackingNo;
        uint status;    // 0--confirm, 1--transporting, 2--received, 3--overtime cancel due, 4--doner cancel
    }
    
    mapping(uint => Item) public items;
    mapping(address => uint[]) private donees;
    mapping(uint => Donation) public donations;
    mapping(address => uint[]) private doners;
    

    Item[] public itemRecord;
    Donation[] public donationRecord;


    event updateItem(
        uint serialNo,
        address donee,
        uint itemId,
        string itemName,
        uint amount,
        uint transporting,
        uint recieved,
        bool isAcceptable
    );
        
    event updateDonation(
        uint donateNo,
        address doner,
        uint serialNo,
        uint amount,
        string itemName,
        string trackingNo,
        uint status
    );

    constructor() public {
        storeName = "Emergency Resource Donation Platform";
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
        _item.amount = _amount;
        _item.transporting = 0;
        _item.recieved = 0;
        _item.isAcceptable = true;
        items[sn] = _item;
        
        donees[msg.sender].push(sn);
        
        emit updateItem(
            _item.serialNo,
            _item.donee,
            _item.itemId,
            _item.itemName,
            _item.amount,
            _item.transporting,
            _item.recieved,
            _item.isAcceptable
        );
    }

    function donateItem(uint _serialNo,  uint _amount) public {
        Item memory _item = items[_serialNo];
        require(_item.serialNo > 0 && _item.serialNo <= sn, 'Item should be in donation');
        require(_amount > 0, "Item's amount is required");
        require(_item.transporting + _item.recieved < _item.amount, 'Item is enough temporarily');
        require(_item.isAcceptable, 'This donation is end');
        require(msg.sender != _item.donee, 'cannot donate self');
        dn++;
        Donation memory _donation;
        _donation.denoteNo = dn;
        _donation.doner = msg.sender;
        _donation.serialNo = _serialNo;
        
        if(_item.amount - _item.transporting - _item.recieved >  _amount) _donation.amount = _amount;
        else _donation.amount = _item.amount - _item.transporting - _item.recieved;
        _donation.itemName = _item.itemName;
        _donation.trackingNo = '';
        _donation.status = 0;
        donations[dn] = _donation;
        
        doners[msg.sender].push(dn);

        items[_serialNo].transporting += _donation.amount;

        //Trigger an event
        emit updateItem(
            _item.serialNo,
            _item.donee,
            _item.itemId,
            _item.itemName,
            _item.amount,
            _item.transporting,
            _item.recieved,
            _item.isAcceptable
        );

        emit updateDonation(
            _donation.denoteNo,
            _donation.doner,
            _donation.serialNo,
            _donation.amount,
            _donation.itemName,
            _donation.trackingNo,
            _donation.status
        );

    }
    
    function transportItem(uint _denoteNo, string memory _trackingNo) public {
        require(_denoteNo > 0 && _denoteNo <= dn, 'donation not exsit');
        require(donations[_denoteNo].status == 0, 'item should been confirm');
        uint _serialNo = donations[_denoteNo].serialNo;
        
        require(_serialNo > 0 && _serialNo <= sn, 'Item should be in donation');
        require(items[_serialNo].serialNo == _serialNo, 'serialNo not match');
        require(msg.sender == donations[_denoteNo].doner, 'should be signed by donee');

        donations[_denoteNo].status = 1;
        donations[_denoteNo].trackingNo = _trackingNo;
        //Trigger an event
        emit updateDonation(
            donations[_denoteNo].denoteNo,
            donations[_denoteNo].doner,
            donations[_denoteNo].serialNo,
            donations[_denoteNo].amount,
            donations[_denoteNo].itemName,
            donations[_denoteNo].trackingNo,
            donations[_denoteNo].status
        );
    }

    function receiveItem(uint _denoteNo) public {
        require(_denoteNo > 0 && _denoteNo <= dn, 'donation not exsit');
        require(donations[_denoteNo].status == 1, 'item should been tranporting');
        uint _serialNo = donations[_denoteNo].serialNo;
        
        require(_serialNo > 0 && _serialNo <= sn, 'Item should be in donation');
        require(items[_serialNo].serialNo == _serialNo, 'serialNo not match');
        require(msg.sender == items[_serialNo].donee, 'should be signed by donee');

        donations[_denoteNo].status = 2;
        items[_serialNo].transporting -= donations[_denoteNo].amount;
        items[_serialNo].recieved += donations[_denoteNo].amount;
        if(items[_serialNo].recieved+ items[_serialNo].transporting >= items[_serialNo].amount) items[_serialNo].isAcceptable = false;
        //Trigger an event
        emit updateDonation(
            donations[_denoteNo].denoteNo,
            donations[_denoteNo].doner,
            donations[_denoteNo].serialNo,
            donations[_denoteNo].amount,
            donations[_denoteNo].itemName,
            donations[_denoteNo].trackingNo,
            donations[_denoteNo].status
        );

        emit updateItem(
            items[_serialNo].serialNo,
            items[_serialNo].donee,
            items[_serialNo].itemId,
            items[_serialNo].itemName,
            items[_serialNo].amount,
            items[_serialNo].transporting,
            items[_serialNo].recieved,
            items[_serialNo].isAcceptable
        );

        itemRecord.push(items[_serialNo]);
        donationRecord.push(donations[_denoteNo]);


    }

    function cancelDonation(uint _denoteNo) public {
        require(_denoteNo > 0 && _denoteNo <= dn, 'donation not exsit');
        require(donations[_denoteNo].status == 0, 'item cannot canceel');
        uint _serialNo = donations[_denoteNo].serialNo;
        
        require(_serialNo > 0 && _serialNo <= sn, 'Item should be in donation');
        require(items[_serialNo].serialNo == _serialNo, 'serialNo not match');
        require(msg.sender == donations[_denoteNo].doner, 'should be cancelled by oneself');

        donations[_denoteNo].status = 4;
        items[_serialNo].transporting -= donations[_denoteNo].amount;
        if(items[_serialNo].recieved + items[_serialNo].transporting >= items[_serialNo].amount) items[_serialNo].isAcceptable = false;
    
        
        //Trigger an event
        emit updateDonation(
            donations[_denoteNo].denoteNo,
            donations[_denoteNo].doner,
            donations[_denoteNo].serialNo,
            donations[_denoteNo].amount,
            donations[_denoteNo].itemName,
            donations[_denoteNo].trackingNo,
            donations[_denoteNo].status
        );
        emit updateItem(
            items[_serialNo].serialNo,
            items[_serialNo].donee,
            items[_serialNo].itemId,
            items[_serialNo].itemName,
            items[_serialNo].amount,
            items[_serialNo].transporting,
            items[_serialNo].recieved,
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
            items[_serialNo].transporting,
            items[_serialNo].recieved,
            items[_serialNo].isAcceptable
        );

    }

    
    function listSerialNo(address _donee) public view returns (uint[] memory) {
        return donees[_donee];
    }

    function listDonateNo(address _doner) public view returns (uint[] memory) {
        return doners[_doner];
    }
    // function itemRecords() public view returns() {
    //     return itemRecord;
    // }
    function doneeRecord(uint _serialNo) public view returns (uint serialNo, string memory itemName, uint amount, uint transporting, uint recieved, bool isAcceptable) {
        require(_serialNo > 0 && _serialNo <= sn, 'Item should be in donation');
        string memory _itemName;
        uint _amount;
        uint _transporting;
        uint _recieved;
        bool _isAcceptable;
        require(_serialNo ==  items[_serialNo].serialNo, 'Item sn not match');
        _itemName = items[_serialNo].itemName;
        _amount = items[_serialNo].amount;
        _transporting = items[_serialNo].transporting;
        _recieved = items[_serialNo].recieved;
        _isAcceptable = items[_serialNo].isAcceptable;
        //return Item[_serialNo];
        return (_serialNo, _itemName, _amount, _transporting, _recieved, _isAcceptable);
    }
    // function donationRecords() public view{
    //     return donationRecord;
    // }
    
    function donerRecord(uint _donateNo) public view returns (uint denoteNo, uint serialNo, string memory itemName, uint amount, uint status) {
        require(_donateNo > 0 && _donateNo <= dn, 'donation num out of range');
        uint _serialNo;
        string memory _itemName;
        uint _amount;
        uint _status;
        require(_donateNo == donations[_donateNo].denoteNo, 'donation sn not match');
        _serialNo = donations[_donateNo].serialNo;
        _itemName = donations[_donateNo].itemName;
        _amount = donations[_donateNo].amount;
        _status = donations[_donateNo].status;
        return (_donateNo, _serialNo, _itemName,_amount, _status);
    }
}