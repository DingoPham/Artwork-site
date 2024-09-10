<template>
    <div class="p-3 m-3">
      <div class="flex over-hidden flex-wrap gap-41">
        <PopupEditor />
      </div>
    </div>
</template>

<script>
import PopupEditor from '../../../admin-page/PopupEditor.vue';

  export default{
    components:{
      PopupEditor
    },
  }
</script>