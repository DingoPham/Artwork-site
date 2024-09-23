<template>
    <div class="ui">
        <div class="ui-1 flex space-between items-center">
            <h1>Hello: {{ userName }}</h1>
            <Logout @logged-out="handleLogout"/>
        </div>
        <hr />
    </div>
</template>

<script>
import Logout from '../../authentication-page/Logout.vue';
    
export default{
    components:{Logout},
    created(){
        const{username} = this.getUserData();
        this.userName= username;
    },
    props:{
        userName:{
            type: String,
            required:true,
            default: ''
        }
    },
    watch:{
        userName(newValue){
            console.log("Update name: ", newValue)
        }
    },
    methods:{
        handleLogout(){
            console.log("Goodbye!")
        },
        getUserData(){
            let token = sessionStorage.getItem("token");
            let username = sessionStorage.getItem("username");
            let role = sessionStorage.getItem("role");

            // If nothing in sessionStorage, check localStorage
            if (!token || !username || !role) {
                token = localStorage.getItem("token");
                username = localStorage.getItem("username");
                role = localStorage.getItem("role");
            }
            return{token, username, role};
        }
    }
}
</script>