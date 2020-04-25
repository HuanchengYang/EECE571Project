import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import Vuex from 'vuex';
import drizzleVuePlugin from "@drizzle/vue-plugin"
import drizzleOptions from "./drizzleOptions"
import UUID from 'vue-uuid'

Vue.config.productionTip = false
Vue.use(Vuex,UUID)
const store = new Vuex.Store({state: {}})
Vue.use(drizzleVuePlugin, { store, drizzleOptions })

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
