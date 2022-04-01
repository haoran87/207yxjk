import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store"
Vue.use(VueRouter)
let  routes = [];

console.log("routers === ",store.state.yqInfo.platform)
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router;