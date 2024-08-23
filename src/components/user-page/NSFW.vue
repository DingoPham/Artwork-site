<template>
    <div>
      <Sidebar :isActive="isSidebarActive" />
      <MainContent :isActive="isSidebarActive" :currentComponent="currentComponent" @toggle-sidebar="toggleSidebar"/>
    </div>
  </template>
  
<script>
  import MainContent from './user-sidebar/MainContent.vue';
  import Sidebar from './user-sidebar/Sidebar.vue';
  
  export default {
    name: 'nsfw-gallery',
    components: {
      Sidebar,
      MainContent,
    },
    data() {
      return {
        isSidebarActive: false,
        currentComponent: 'nsfw'
      };  },
    methods: {
      toggleSidebar() {
        this.isSidebarActive = !this.isSidebarActive;
      }
    }
  }
  </script>