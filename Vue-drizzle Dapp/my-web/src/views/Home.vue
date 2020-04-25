<template>
  <div class="home">
    <Toast/>
    <AccountsInfo/>
    <v-container class="my-4">
    <v-card app raised>
      <v-row class="ma-2">
        <v-card-title class="text display-1">Donation Record</v-card-title>
        <v-spacer col-md-5/>
        <v-divider vertical class="ma-2"/>
        <v-card-actions>
         <v-select
          v-model="selected"
          @input='eventShow'
          :items="select_items"
          label="Event"
        ></v-select>
        </v-card-actions>
      </v-row>
      <v-divider/>
      <v-container class="my-2" v-show="event_display">
        <!-- raising  -->
        <v-row>
          <v-card-subtitle class="display-1">Item</v-card-subtitle>
          <v-divider/>
          <v-container>
              <div>search records of donee by entering serial no.</div>
              <drizzle-contract-form
                  contractName="EthDonation"
                  method="listSerialNo"
                  :placeholders="placeholders1"
              />
          </v-container>

          <v-container>
              <!-- <div>item records</div>
              <drizzle-contract-form
                  contractName="EthDonation"
                  method="itemRecord"
                  label='item records'
                  toUtf8
              /> -->
          </v-container>
        </v-row>

      </v-container>
    </v-card>
    </v-container>
    
  </div>
</template>

<script>
// @ is an alias to /src
import {mapGetters} from 'vuex'
import AccountsInfo from '@/drizzleVue/AccountsInfo'
import {uuid} from 'vue-uuid'
import Toast from '@/components/MainPage/Toast'

//import Toasted from 'vue-toasted';
// import Donee from '@/views/Donee'
// import Donor from '@/views/Donor'

export default {
  name: 'Home',
  
  components: {
    AccountsInfo,
    Toast,
    // Donee,
    // Donor,

  },

  data(){
    return{
      hide_item1:false,
      event_display:false,
      //item_show_bool:false,
      selected:'',
      select_items: [
        {
          text: "covid-19",
        }
      ],
      money_due:'2020/05/31',
      projetcs_Items:[ {id:uuid.v1(),
            serialNo:'',
            itemName:'',
            itemNeedAmount:'',
            itemRaisedAmount:'',},
            {id:uuid.v1(),
             serialNo:'',
            itemName:'',
            itemNeedAmount:'',
            itemRaisedAmount:'',}],
      
  
    }
    },
    computed: {
            ...mapGetters('drizzle', ['isDrizzleInitialized']),
            placeholders1() { //list of donee
                return ['donee address']
            },
     },
  
     methods:{
       eventShow(){
         if(this.selected == "covid-19"){
           this.event_display=true
         }
       },
     },
 
}

</script>
