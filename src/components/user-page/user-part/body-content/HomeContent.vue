<template>
    <div class="p-3 m-3 p-3-2 m-3-2">
      <Loader v-if="isLoading" />
      <AccountEmpty v-if="userRole === 'guest'"/>
      <AccountDetected v-if="userRole !== 'guest'" :userName="userName"/>
      <div>
        <SFWArtContent :userRole = "userRole"/>
      </div>
    </div>
</template>

<script>
import SFWArtContent from '../../../admin-page/SFWArtContent.vue';
import AccountDetected from '../../../admin-page/other-admin-fuction/AccountDetected.vue';
import AccountEmpty from '../../../admin-page/other-admin-fuction/AccountEmpty.vue';
import Loader from '../../../other-functions/Loader.vue';
  export default{
    components:{
      SFWArtContent, AccountEmpty, AccountDetected, Loader
    },
    data(){
      return{
        userRole: 'guest', //default value for guest
        userName: '',
        isLoading: true,
      };
    },
    created(){
      this.checkUserRole()
    },
    methods:{
      async checkUserRole(){
        this.isLoading = true
        const token = localStorage.getItem('token');

        if(!token){
          this.userRole = 'guest'; // default role for unknow guest if can't find token
          this.isLoading = false;
          return;
        }

        // check token format
        const tokenParts = token.split('.');
        if(tokenParts.length !== 3){
          this.userRole = 'guest';
          this.isLoading = false;
          return;
        }

        try{
          // get role 
          const decodedToken = JSON.parse(atob(tokenParts[1]));

          this.userRole = decodedToken.role;
          this.userName = decodedToken.username;
        }
        catch (error){
          console.error('Error decoding token: ', error);
          this.userRole = 'guest';
        }
        finally{
          this.isLoading = false
        }
      }
    }
  };
</script>