<template>
  <v-app>
    <Navbar/>
    <Footer></Footer>
    <v-content class="mx-8">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from '@/components/MainPage/Navbar'
import Footer from '@/components/MainPage/Footer'
import Vue from 'vue'
import Toasted from 'vue-toasted'
Vue.use(Toasted)
export default {
  name: 'App',

  components: {
    Navbar,
    Footer
  },

  data: () => ({
    //
  }),
};
</script>
