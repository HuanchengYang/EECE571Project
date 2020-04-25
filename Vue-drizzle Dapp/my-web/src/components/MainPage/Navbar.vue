<template>
  <nav>
      <v-app-bar app height="80" :clipped-left="$vuetify.breakpoint.lgAndUp">
          <v-app-bar-nav-icon @click="drawer=!drawer" class="text grey--text">
          </v-app-bar-nav-icon>
          <v-toolbar-title class="text display-2" >
              <span class="text font-weight-light blue-grey--text">Donation</span>
              <span class="text font-weight-bold blue-gray--text">DApp</span>
          </v-toolbar-title>

          <v-spacer/>
          <!-- everything aligns right from here -->

          <v-btn @click="toMain" to="/" icon>
              <v-icon large>mdi-home</v-icon>
          </v-btn>
      </v-app-bar>
      <v-navigation-drawer app v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp">
        <v-list>
            <template v-for="item in items">
                <v-row
                        v-if="item.heading"
                        :key="item.heading"
                        align="center"
                >
                    <v-col cols="6">
                        <v-subheader v-if="item.heading">
                            {{ item.heading }}
                        </v-subheader>
                    </v-col>
                    <v-col
                            cols="6"
                            class="text-center"
                    >
                        <a
                                href="#!"
                                class="body-2 black--text"
                        >EDIT</a>
                    </v-col>
                </v-row>
                <v-list-group
                        v-else-if="item.children"
                        :key="item.text"
                        v-model="item.model"
                        :prepend-icon="item.model ? item.icon : item['icon-alt']"
                        append-icon=""

                        
                        
                >
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ item.text }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item
                            v-for="(child, i) in item.children"
                            :key="i"
                            router :to="child.route"

                    >
                        <v-list-item-action v-if="child.icon">
                            <v-icon>{{ child.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ child.text }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                <v-list-item
                        v-else
                        :key="item.text"
                        router :to="child.route"
                >
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ item.text }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-list>
      </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
    name: 'Navbar',
    data() {
      return {
        drawer: false,
        items: [
                {
                    icon: 'mdi-account-heart-outline', 'icon-alt': 'mdi-account-heart-outline',
                    text: 'Donor',
                    model: false,

                    children:[
                        {icon: 'mdi-account-plus-outline', text: 'Sign Up', route:'/donor-signup'},
                        {icon: 'mdi-login-variant', text: 'Login', route:'/donor'},
                    ],
                },
                {
                    icon: 'mdi-account-arrow-left-outline', text: 'Donee',  'icon-alt': 'mdi-account-arrow-left-outline',
                    model: false,
                    children:[
                        {icon: 'mdi-account-plus-outline', text: 'Sign Up', route:'/donee-signup'},
                        {icon: 'mdi-login-variant', text: 'Login', route:'/donee'},
                    ],
                },
            ],
      }
    },
    methods:{
        toMain(){
            console.log('toMain')
        }
    }

}

</script>

<style>

</style>