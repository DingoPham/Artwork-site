<template>
    <div class="p-3 m-3">
      <div class="flex over-hidden flex-wrap gap-41">
        <div v-for="image in images" :key="image.id">
          <img :src="image.imgUrl" alt=""/>
        </div>
      </div>
      <NavigationFunction />
    </div>
</template>

<script>
import NavigationFunction from '../../../admin-page/admin-function/NavigationFunction.vue';

  export default{
    components:{
      NavigationFunction
    },
    data(){
      return{
        images: []
      };
    },
    created(){
      this.fetchImages();
    },
    methods:{
      fetchImages(){
        fetch('https://localhost:7064/ArtworkCombine')
        .then(response => response.json())
        .then(data => {
          this.images = data.list_data_sfwart;
          console.log(data)
        })
        .catch(error => {
          console.error('Can not get any images, error:', error);
        })
      }
    }
  }
</script>