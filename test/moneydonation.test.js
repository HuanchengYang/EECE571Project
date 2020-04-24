const MoneyDonationPlatform = artifacts.require("MoneyDonationPlatform");
require('chai')
    .use(require('chai-as-promised'))
    .should();


contract(MoneyDonationPlatform, ([deployer, donator, vendor]) => {
    let mdplatform;
    before(async () => {
        mdplatform = await MoneyDonationPlatform.deployed()
    })
    describe('Deployment', async () => {
        it('The deployment should be done successfully', async () => {
            const address = await mdplatform.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
            
        })

        /* it('The deployed smart contract has the correct name', async () => {
            const name = await MoneyDonationPlatform.getCampaignName();
            assert.equal(name.toString(), 'Harry');
            const description = await MoneyDonationPlatform.getCampaignDescription();
            assert.equal(description.toString(), 'COVID-19')
        }) 

        it('The deployed smart contract has the correct address', async () => {
            const address = await MoneyDonationPlatform.creator();
            assert.equal(address,deployer);
        }) 
        */
    })

    describe('CreateMoneyDonation',async ()=>{
        let address
        before(async() => {
            result=await  mdplatform.newMoneyDonation('Harry','COVID-19',web3.utils.toWei('10', 'Ether'),{ from: deployer});
        })

        it('The subcontract deployment should be done successfully', async () => {
            const event = await result.logs[0].args;
            address = event.subcontract;
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
            assert.equal(event.donee,deployer)
        })

        it('The subcontract deployment should be done correctly', async () => {
            var md = await mdplatform.getContract();
            console.log(md);

            var fs = require('fs');
            var jsonFile = "./src/abis/moneyDonation.json";
            var parsed= JSON.parse(fs.readFileSync(jsonFile));
            var abi = parsed.abi;

            var mdcontract = new web3.eth.Contract(abi, md);
            //const address = await mdcontract.methods.getRequiredAmount().call();
            const name = await mdcontract.methods.getCampaignName().call();

            
            assert.equal(name, 'Harry')
            assert.equal(address,mdcontract.options.address)
            
        })
    })

    /* describe('DonateMoney', async () => {
        let totalNumber,donated
        before(async () => {
            result = await MoneyDonationPlatform.donateMoney(web3.utils.toWei('1', 'Ether'),'Stay Safe!','Peter',{ from: donator,value: web3.utils.toWei('1', 'Ether')});
            totalNumber = await MoneyDonationPlatform.totalDonator();
            donated = await MoneyDonationPlatform.donatedAmount();
        })
        it('Donator Name should be correct', async () => {
            //SUCCESSFUL
            const event = result.logs[0].args;
            assert.equal(totalNumber, 1);
            assert.equal(event.donatorName.toString(), 'Peter', 'donator name is correct');
        })

        it('Donator address should be correct', async () => {
            //SUCCESSFUL
            const event = result.logs[0].args;
            assert.equal(event.donatorAddress,donator, 'donator address');
        })
        it('Donator address should be correct', async () => {
            //SUCCESSFUL
            const event = result.logs[0].args;
            assert.equal(event.donationAmount, web3.utils.toWei('1', 'Ether'), 'donated amount is correct');
        })

        it('Donated amount should be correct', async () => {
            //SUCCESSFUL
            const event = result.logs[0].args;
            assert.equal(event.donationAmount, web3.utils.toWei('1', 'Ether'), 'donated amount is correct');
        })

        it('current balance should be correct', async () => {
            //SUCCESSFUL
            const balance = await MoneyDonationPlatform.remainingBalance();
            assert.equal(balance, web3.utils.toWei('1', 'Ether'), 'donated amount should be correct');
            let balance2 = await web3.eth.getBalance(MoneyDonationPlatform.address);
            assert.equal(balance2, web3.utils.toWei('1', 'Ether'),'contract balance shoule be correct');
            const requiredAmount2 = await MoneyDonationPlatform.requiredAmount();
            assert.equal(requiredAmount2, web3.utils.toWei('9', 'Ether'), 'required Amount should be correct');

        })

        it('Check the donation created', async () => {
            const donation = await MoneyDonationPlatform.donationList(totalNumber);
            assert.equal(donation.donationID.toNumber(), totalNumber.toNumber(), 'donation id is correct');
            assert.equal(donation.donatorName, 'Peter', 'donator name is correct');
            assert.equal(donation.donationMessage, 'Stay Safe!', 'donator message is correct');
            assert.equal(donation.donationAmount,web3.utils.toWei('1', 'Ether'), 'donation amount is correct');
            assert.equal(donation.donatorAddress, donator, 'DonatorAddress is correct');
            assert.equal(donation.isCompleted, true, 'donation completed!');
        })
    }) */

    /* describe('Spend Money', async () => {
        let result,totalNumber,spent
        before(async () => {
            result = await MoneyDonationPlatform.spendMoney(web3.utils.toWei('0.3', 'Ether'),vendor,'Masks',{from: deployer});
            totalNumber = await MoneyDonationPlatform.totalExpense();
            spent = await MoneyDonationPlatform.spentAmount();
        })

        it('vendor address should be correct', async () => {
            //SUCCESSFUL
            const event = result.logs[0].args;
            assert.equal(event.vendor, vendor, 'donated amount is correct');
        })

        
        it('Check the spending created', async () => {
            const spending = await MoneyDonationPlatform.expenseList(totalNumber);
            assert.equal(spending.expenseID.toNumber(), totalNumber.toNumber(), 'spending id is correct');
            assert.equal(spending.spentAmount, web3.utils.toWei('0.3', 'Ether'), 'spending amount is correct');
            assert.equal(spending.vendor, vendor, 'vendor address is correct');
            assert.equal(spending.extraInfo, 'Masks', 'spending description is correct');
            assert.equal(spending.isApproved, false, 'spending has not approved yet'); 
        })
    })
        

     describe('Approave the spending', async () => {
        let result2,result,expenseNumber,spent
        before(async () => {
            //result2 = await MoneyDonationPlatform.spendMoney(web3.utils.toWei('0.3', 'Ether'),vendor,'Masks',{from: deployer});
            const expenseNumber = 1;
            result = await MoneyDonationPlatform.approveSpending(expenseNumber,{from: vendor});
            remainingBalance = await MoneyDonationPlatform.remainingBalance();
        })

        
        it('Check the spending is approaved', async () => {
            const expenseNumber = 1;
            const spending = await MoneyDonationPlatform.expenseList(expenseNumber);
            assert.equal(spending.isApproved, true, 'spending should be approved now'); 
        })

        it('Check the spent amount', async () => {
            const expenseNumber = 1;
            spent = await MoneyDonationPlatform.spentAmount();
            const spending = await MoneyDonationPlatform.expenseList(expenseNumber);
            assert.equal(spending.spentAmount, web3.utils.toWei('0.3', 'Ether'), 'spending should be the same'); 
            assert.equal(spent, web3.utils.toWei('0.3', 'Ether'), 'spending should be the same'); 
        })

        it('Check the remaining balance', async () => {
            const remaining = await MoneyDonationPlatform.remainingBalance();
            assert.equal(remaining, web3.utils.toWei('0.7', 'Ether'), 'remaining balance should be the same'); 
        })
        it('Check the contract balance', async () => {
            const remaining = await web3.eth.getBalance(MoneyDonationPlatform.address);
            assert.equal(remaining, web3.utils.toWei('0.7', 'Ether'), 'remaining balance should be the same'); 
        })

    })  */

});
