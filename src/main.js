import Vue from 'vue'

import VueResource from 'vue-resource'
Vue.use(VueResource)

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import App from './App.vue'
import Home from './Home.vue'
import Day from './Day.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/days/:date', component: Day }
];

const router = new VueRouter({
  routes // short for routes: routes
});

const app = new Vue({
  router,
  name: 'Futuro',
  render: h => h(App),
  template: '<App/>',
  components: { App }
}).$mount('#app');
