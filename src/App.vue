<template>
  <div id="app">
    <router-view/>
    <FunctionsContainer />
  </div>
</template>

<script>
import FunctionsContainer from './components/other-functions/FunctionsContainer.vue'
export default {
  components: { FunctionsContainer },
  name: 'App'
}
</script>

<style>
#app {
  font-family: Quicksand, cursive;
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style src="@/assets/Style/styleMain.css">
</style>
<style src="@/assets/Style/head.css">
</style>
<style src="@/assets/Style/body.css">
</style>
<style src="@/assets/Style/foot.css">
</style>
<style src="@/assets/Style/function.css">
</style>