<template>
    <v-app>
        <!-- <Toast/> -->
        <AccountsInfo/>
            <v-card>
            <v-card-title class="display-2" raised>Donor</v-card-title>
            <v-row>
                <v-container>
                    <v-card-subtitle class="display-1">Item</v-card-subtitle>
                    <v-divider/>
                    <v-container>
                        <div>Doante Items</div>
                        <drizzle-contract-form
                        contractName="EthDonation"
                        method="donateItem"
                        :placeholders="placeholders1"
                        />
                        <div>Cancel Donation</div>
                        <drizzle-contract-form
                            contractName="EthDonation"
                            method="cancelDonation"
                            :placeholders="placeholders2"
                        />
                        <div>UpdateTracking No.</div>
                        <drizzle-contract-form
                            contractName="EthDonation"
                            method="transportItem"
                            :placeholders="placeholders3"
                        />
                        <div>Record</div>
                        <drizzle-contract-form
                            contractName="EthDonation"
                            method="donerRecord"
                            :placeholders="placeholders4"
                        />
                        <div>List of Donation</div>
                        <drizzle-contract-form
                            contractName="EthDonation"
                            method="listDonateNo"
                            :placeholders="placeholders5"
                        />
                        
                    </v-container>

                </v-container>
                <v-container>
                    <v-card-subtitle class="display-1">Money</v-card-subtitle>
                    <v-divider/>
                    <v-container>
                        <div>donate</div>
                        <drizzle-contract-form
                        contractName="MoneyDonation"
                        method="donateMoney"
                        :placeholders="placeholders6"
                        />
                    </v-container>
                </v-container>
                </v-row>
        </v-card>
    </v-app>
</template>

<script>
    import AccountsInfo from '@/drizzleVue/AccountsInfo'
    // import Toast from '@/components/MainPage/Toast'
    import {mapGetters} from 'vuex';
    export default {
        name: "Donor",
        components:{
            AccountsInfo,
           // Toast
        },
          computed: {
            ...mapGetters('drizzle', ['isDrizzleInitialized']),
            placeholders1() { //donate item
                return ['serial no.', 'item amount']
            },

            placeholders2() { //cancel donation
                return ['donate no.']
            },
            placeholders3() {//update tracking no.
                return ['donate no.', 'tracking no.']
            },
            placeholders4() {//udonor record
                return ['donate no.']
            },

            placeholders5() {//udonor record
                return ['donor address']
            },
            placeholders6() {//donate money
                return ['amount', 'message', 'donor name']
            },
          },

        data(){
            return{
                donation:[{
                    id:1,
                    donor:'439800jkjk',
                    donee:'f4343',
                    serialNo:808090,
                    itemName:'4343fdsf',
                    trackingNo:432321,
                }],

            }
        },

  
        methods:{
            addItem(e,item){
                this.donation.push(item)
            }
        },
        
    }
</script>

<style scoped>

</style>