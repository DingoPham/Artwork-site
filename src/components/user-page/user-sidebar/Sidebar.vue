<template>
    <div class="sidebar po-fixed w-300px h-100p f-20" :class="{ active: isActive }">
      <div class="m-t-l">
        <p class="m-b tx-w f-30-n">Home</p>
        <router-link to="/">Art Gallery</router-link>
        <router-link to="/video-gallery">Video Gallery</router-link>
        <router-link to="/nsfw-gallery">NSFW Gallery</router-link>
        <p class="m-b tx-w f-30-n">Support Me</p>
        <a href="https://www.youtube.com/channel/UCtH0_zKVeXOKO2hiqLoHSrg">Follow my Youtube</a>
        <a href="https://buymeacoffee.com/dingopham763/membership">Buy me a coffee</a>
        <p class="m-b tx-w f-30-n">Other Things</p>
        <a href="https://dingopham.github.io">My Blog</a>
      </div>
    </div>
</template>
<script>
  export default {
    props: {
      isActive: {
        type: Boolean,
        default: false
      }
    }
  }
</script>