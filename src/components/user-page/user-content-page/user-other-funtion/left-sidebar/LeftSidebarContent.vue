<template>
    <div class="content" :class="{ shift: isActive }">
      <div @click="$emit('toggle-sidebar')">
        <SidebarButton />
      </div>
      <router-view></router-view>
    </div>
</template>

<script>
import SidebarButton from './bar-button/SidebarButton.vue';

export default {
  components:{SidebarButton},
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  }
}
</script>