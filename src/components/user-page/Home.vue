<template>
  <main>
    <!-- <h1>{{ msg }}</h1> -->
    <Header />
    <Content />
    <Footer />
  </main>
</template>

<script>
import Content from './user-content-page/Content.vue';
import Footer from './user-content-page/Footer.vue';
import Header from './user-content-page/Header.vue';

export default {
  name: 'Home',
  components:{Header, Content, Footer},
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
}
</script>

<style src="@/assets/Style/styleMain.css">
</style>
<style src="@/assets/Style/head.css">
</style>
<style src="@/assets/Style/body.css">
</style>
<style src="@/assets/Style/foot.css">
</style>