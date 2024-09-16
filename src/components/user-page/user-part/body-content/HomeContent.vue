<template>
    <div class="p-3 m-3">
      <UserInterface />
      <div class="flex over-hidden flex-wrap gap-41">
        <SFWArtContent />
      </div>
    </div>
</template>

<script>
import SFWArtContent from '../../../admin-page/SFWArtContent.vue';
import UserInterface from '../../../other-admin-fuction/UserInterface.vue';

  export default{
    components:{
      SFWArtContent, UserInterface
    },
  }
</script>