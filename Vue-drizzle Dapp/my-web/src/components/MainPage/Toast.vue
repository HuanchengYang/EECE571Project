<template>
    <section></section>
</template>

<script>
    import Toasted from 'vue-toasted';
    import Vue from 'vue'
    import {uuid} from 'vue-uuid'

    Vue.use(Toasted)
    export default {
        name: "Toast",
        data(){
            return{
                projetcs_Items:[ {
                    id:uuid.v1(),
                    serialNo:'',
                    itemName:'',
                    itemNeedAmount:'',
                    itemRaisedAmount:'',},
           ],
            }
        },
        mounted() {
        const  contractEventHandler = ({contractName, eventName, data}) => {
            let display
            const  subOptions = { duration: 6000};  
            if(contractName == 'EthDonation') {
                if(eventName=='updateItem'){
                    display = `(${eventName}): donee:${data.donee}, serial no.:${data.serialNo},item name:${data.itemName} item amount:${data.amount}`
                    this.$toasted.show(display, subOptions);
                }
                else if (eventName =='updateDonation') {
                    display = `(${eventName}): donateNo:${data.donateNo}, serial no.:${data.serialNo}, donor: ${data.doner}, item name:${data.itemName} amount:${data.amount} tracking No. ${data.trackingNo}`
                    this.$toasted.show(display, subOptions);
                }
            }
            else if(contractName == 'Moneyprojetcs_Items') {
                if(eventName=='MoneyDonated'){
                    display = `(${eventName}): donor Name: ${data.donatorName}, donor address: ${data.donatorAddress}, donation amount: ${data.donationAmount}, requiredAmount: ${data.requiredAmount} `
                    this.$toasted.show(display, subOptions);
                }
                else if (eventName =='MoneySpent') {
                    display = `(${eventName}): spent amount: ${data.spentAmount}, vendor: ${data.vendor}, extra info: ${data.extraInfo}, isAproved: ${data.isApproved}`
                    this.$toasted.show(display, subOptions);
                }
            }
           };

           this.$drizzleEvents.$on('drizzle/contractEvent', payload => {
                contractEventHandler(payload);
            });
        }
    }
</script>

<style scoped>

</style>