<template>
    <div class="m-c" :class="{ shift: isActive }">
      <header class="navbar flex flex-reverse-2">
        <div @click="$emit('toggle-sidebar')" class="h-16 m-22">
          <SidebarIcon />
        </div>
        <HeaderLite />
      </header>
        <content>
          <HomeContent v-if="currentComponent === 'home'" />
          <NSFWContent v-if="currentComponent === 'nsfw'" />
          <VideoContent v-if="currentComponent === 'video'" />
          <NSFWVideoContent v-if="currentComponent === 'nsfwvideo'" />
        </content>
      <Footer />
    </div>
  </template>
  
  <script>
import HomeContent from '../user-part/body-content/HomeContent.vue';
import NSFWContent from '../user-part/body-content/NSFWContent.vue';
import NSFWVideoContent from '../user-part/body-content/NSFWVideoContent.vue';
import VideoContent from '../user-part/body-content/VideoContent.vue';
import Footer from '../user-part/Footer.vue';
import HeaderLite from '../user-part/HeaderLite.vue';
import SidebarIcon from './SidebarIcon.vue';

  export default {
    components:{ Footer, HeaderLite, SidebarIcon, HomeContent, NSFWContent, VideoContent, NSFWVideoContent},
    props: {
      isActive: {
        type: Boolean,
        default: false
      },
      currentComponent:{
      type: String,
      default: 'home'
    }
  },  
}
  </script>
  