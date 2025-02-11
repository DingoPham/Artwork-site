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
import { jwtDecode } from 'jwt-decode';
    
export default{
    components:{Logout},
    data(){
        return{
            userName: ''
        }
    },
    created(){
        this.loadUserData();
    },
    methods:{
        handleLogout(){
        },
        loadUserData(){
            let token = localStorage.getItem("token");
            if (token) {
                try {
                    // Kiểm tra token có đúng 3 phần không
                    if (token.split('.').length !== 3) {
                        throw new Error("Invalid token format");
                    }
                    const decoded = jwtDecode(token);
                    this.userName = decoded.username ? decodeURIComponent(escape(atob(decoded.username))) : "Invalid username";
                } catch (error) {
                    console.error("Error decoding token:", error);
                    this.userName = "Invalid username";
                }
            } else {
                this.userName = "Guest";
            }
        }
    }
}
</script>