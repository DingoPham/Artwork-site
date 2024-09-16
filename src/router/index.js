import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/user-page/Home.vue'
import Video from '../components/user-page/Video.vue'
import NSFW from '../components/user-page/NSFW.vue'
import Admin from '../components/admin-page/Admin.vue'
import Register from '../components/authentication-page/Register.vue'
import Login from '../components/authentication-page/Login.vue'
import Forget from '../components/authentication-page/Forget.vue'

Vue.use(Router)

export const EventBus = new Vue();
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/video-gallery',
      name: 'video-gallery',
      component: Video
    },
    {
      path: '/nsfw-gallery',
      name: 'nsfw-gallery',
      component: NSFW
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/forget',
      name: 'forget-password',
      component: Forget
    }
  ]
})
