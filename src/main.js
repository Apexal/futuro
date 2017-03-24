import Vue from 'vue'

import router from './router'

import VueResource from 'vue-resource'
Vue.use(VueResource)

import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'

new Vue({
  name: 'Futuro',
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
