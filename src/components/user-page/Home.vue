<template>
  <div>
    <Sidebar :isActive="isSidebarActive" />
    <MainContent :isActive="isSidebarActive" :currentComponent="currentComponent" @toggle-sidebar="toggleSidebar" />
  </div>
</template>

<script>
import MainContent from './user-sidebar/MainContent.vue';
import Sidebar from './user-sidebar/Sidebar.vue';

export default {
  components: {
    Sidebar,
    MainContent
  },
  data() {
    return {
      isSidebarActive: false,
      currentComponent: 'home'
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarActive = !this.isSidebarActive;
    }
  }
}
</script>