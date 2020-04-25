import EthDonation from "@/artifacts/EthDonation.json";
import MoneyDonation from "@/artifacts/MoneyDonation.json"

const options = {
    web3: {
        block: false,
        fallback: {
            type: "ws",
            url: "ws://127.0.0.1:7545"
        }
    },

    // The contracts to monitor
    contracts: [EthDonation, MoneyDonation],
    events: {
        EthDonation: ['updateItem', 'updateDonation'],
        MoneyDonation: ['MoneyDonated', 'MoneySpent']

    },
    polls: {
        // check accounts every 1 seconds
        accounts: 1000
    }
}

export default options;