import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Home from '../pages/Home'
import Day from '../pages/Day'
import NotFound from '../pages/NotFound'

const routes = [
  Home,
  Day,
  NotFound
]

const router = new VueRouter({
  routes
})

export default router
