<template>
    <v-app>
        <!-- <Toast/> -->
        <AccountsInfo/>
        <v-card>
            <v-card-title class="display-2" raised>Donee</v-card-title>
            <v-row>
                <v-container>
                    <v-card-subtitle class="display-1">Item</v-card-subtitle>
                    <v-divider/>
                    <v-container>
                        <div>Raising</div>
                        <drizzle-contract-form
                            contractName="EthDonation"
                            method="createItem"
                            :placeholders="placeholders1"
                        />
                        <div>Confirmation</div>
                        <drizzle-contract-form
                            contractName="EthDonation"
                            method="receiveItem"
                            :placeholders="placeholders4"
                        />
                        <div>End Donation</div>
                        <drizzle-contract-form
                            contractName="EthDonation"
                            method="endDonation"
                            :placeholders="placeholders6"
                        />
                    </v-container>

                </v-container>
                <v-container>
                    <v-card-subtitle class="display-1">Money</v-card-subtitle>
                    <v-divider/>
                    <v-container>
                        <div>Raising</div>
                        <drizzle-contract-form
                        contractName="MoneyDonation"
                        method='updateRequiredAmount'
                        :placeholders='placeholders3'
                        />
                        <div>Spend</div>
                        <drizzle-contract-form
                        contractName="MoneyDonation"
                        method='spendMoney'
                        :placeholders='placeholders2'
                        />  
                        <div>Approve Spending</div>
                        <drizzle-contract-form
                        contractName="MoneyDonation"
                        method='aproveSpending'
                        :placeholders5='placeholders5'
                        />
                    </v-container>
                </v-container>
                </v-row>
        </v-card>
    </v-app>
</template>

<script>
    import {mapGetters} from 'vuex';
    import AccountsInfo from '@/drizzleVue/AccountsInfo'
    // import Toast from '@/components/MainPage/Toast'
    
   

    export default {
        name: "Donee",
        components: {
            AccountsInfo,
            // Toast,
        }, 
        
        computed: {
            ...mapGetters('drizzle', ['isDrizzleInitialized']),

            placeholders1() {
                return ['item name', 'item amount']
            },
            placeholders2() {
                return ['spend amount', 'vendor', 'description']
            },

            placeholders3() {
                return ['Money Need']
            },
            placeholders4() {
                return ['donate no.']
            },
            placeholders5() {
                return ['expense ID']
            },
            placeholders6() { //end donation
                return ['serial no']
            },
            

        },
        data() {
            return {
                items: [],
                events:[],
            }
        },
        // methods:{
        //     addNewItem(newItem){
        //         const{title,number} = newItem;
                
        //     }
        // }
    }
</script>

<style scoped>

</style>