<template>
  <v-container class="my-4">
    <v-card app>
      <v-row class="ma-2">
        <v-card-title>Current Account Info</v-card-title>
      </v-row>
      <v-divider/>
      <v-container class="my-2">
        <drizzle-account units="Ether" :precision="2" />
      </v-container>
   
    </v-card>
    </v-container>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    name:'AccountsInfo',
    computed : {
            ...mapGetters('accounts', ['activeAccount', 'activeBalance']),
        },
  

}
</script>

<style>

</style>