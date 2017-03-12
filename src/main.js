import Vue from 'vue'

import VueResource from 'vue-resource'
Vue.use(VueResource)

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import App from './App.vue'
import Home from './Home.vue'
import Day from './Day.vue'
import Person from './Person.vue'
import People from './People.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/days/:date', name: 'day', component: Day },
  { path: '/people', name: 'people', component: People },
  { path: '/people/:name', name: 'person', component: Person }
];

const router = new VueRouter({
  routes, // short for routes: routes
  //mode: 'history'
});

const app = new Vue({
  router,
  name: 'Futuro',
  render: h => h(App),
  template: '<App/>',
  components: { App }
}).$mount('#app');
