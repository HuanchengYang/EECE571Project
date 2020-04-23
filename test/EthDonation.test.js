const EthDonation = artifacts.require("EthDonation");
require('chai')
    .use(require('chai-as-promised'))
    .should();

contract(EthDonation, ([donee, doner1, doner2]) => {
    let ethdonation;
    before(async() => {
        ethdonation = await EthDonation.deployed()
    })
    describe('Deployment', async() => {
        it('The deployment should be done successfully', async() => {
            const address = await ethdonation.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('The deployed smart contract has the correct name', async() => {
            const name = await ethdonation.storeName();
            assert.equal(name, 'Emergency Resource Donation Platform')
        })
    })

    describe('Creating and ending donation', async() => {
        let result, totalNumber

        before(async() => {
            result = await ethdonation.createItem('N95 mask', 100, { from: donee })
            totalNumber = await ethdonation.sn()
        })
        it('Creating donation should be successful if all correct', async() => {
            //SUCCESSFUL
            assert.equal(totalNumber, 1);
            const event = result.logs[0].args;
            assert.equal(event.serialNo.toNumber(), totalNumber.toNumber(), 'serialNo is correct');
            assert.equal(event.donee, donee, 'donee is correct');
            assert.equal(event.itemId.toNumber(), 0, 'item id is correct');
            assert.equal(event.itemName, 'N95 mask', 'item name is correct');
            assert.equal(event.amount.toNumber(), 100, 'amount is correct');
            assert.equal(event.transporting.toNumber(), 0, 'transporting is correct');
            assert.equal(event.recieved.toNumber(), 0, 'recieved is correct');
            assert.equal(event.isAcceptable, true, 'isAcceptable is correct');
        })

        it('Creating donation should be failed if either no item name or no amount', async() => {
            //Product must have a itemname
            await ethdonation.createItem('', 100, { from: donee }).should.be.rejected;
            //amount must be greater than 0
            await ethdonation.createItem('N95 mask', 0, { from: donee }).should.be.rejected;
        })

        it('Published donation can not be ended by person who did not make it', async() => {
            await ethdonation.endDonation(totalNumber, { from: doner1 }).should.be.rejected;
        })
        it('Published donation can only be ended by person who did make it', async() => {
            result = await ethdonation.endDonation(totalNumber, { from: donee });
        })
    })

    describe('Making and cancelling donation', async() => {
        let result, serialNumber, donateNumber

        before(async() => {
            await ethdonation.createItem('N95 mask', 100, { from: donee })
            serialNumber = await ethdonation.sn()
        })
        it('Making donation should be successful if all correct', async() => {
            //SUCCESSFUL
            result = await ethdonation.donateItem(serialNumber, 10, { from: doner1 })
            donateNumber = await ethdonation.dn()
        })

        it('Makeing donation should be failed if either wrong serialNo or no amount', async() => {
            //Product must have correct serialNo
            await ethdonation.donateItem(serialNumber, 0, { from: doner1 }).should.be.rejected;
            //amount must be greater than 0
            await ethdonation.donateItem(serialNumber + 1, 10, { from: doner1 }).should.be.rejected;
        })

        it('Makeing donation should be failed if donation amount is full', async() => {
            await ethdonation.donateItem(serialNumber, 100, { from: doner1 });
            //amount is full
            await ethdonation.donateItem(serialNumber, 10, { from: doner1 }).should.be.rejected;
        })

        it('Donation can not be cancelled by person who did not make it', async() => {
            await ethdonation.cancelDonation(serialNumber, { from: doner2 }).should.be.rejected;
        })
        it('Published donation can only be ended by person who did make it', async() => {
            result = await ethdonation.cancelDonation(serialNumber, { from: doner1 });
        })
    })

    describe('Transporting and confirm recieved', async() => {
        let result, serialNumber, donateNumber

        before(async() => {
            await ethdonation.createItem('N95 mask', 100, { from: donee })
            serialNumber = await ethdonation.sn()
            await ethdonation.donateItem(serialNumber, 10, { from: doner1 })
            donateNumber = await ethdonation.dn()
        })

        it('Person who is not the doner can not change the donation status to transporting', async() => {
            await ethdonation.transportItem(donateNumber, 'DHL0001', { from: doner2 }).should.be.rejected;
        })

        it('Only the doner can change his donation status to transporting', async() => {
            await ethdonation.transportItem(donateNumber, 'DHL0001', { from: doner1 });
        })

        it('Person who is not the donee can not comfirm the donation to him is recieved ', async() => {
            await ethdonation.receiveItem(donateNumber, { from: doner2 }).should.be.rejected;
        })

        it('Only the donee can comfirm the donation to him is recieved', async() => {
            await ethdonation.receiveItem(donateNumber, { from: donee });
        })
    })

});