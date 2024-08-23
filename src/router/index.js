import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/user-page/Home.vue'
import Video from '../components/user-page/Video.vue'
import NSFW from '../components/user-page/NSFW.vue'

Vue.use(Router)

export const EventBus = new Vue();
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
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
    }
  ]
})
