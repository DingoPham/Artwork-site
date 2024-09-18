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
        }
    }
}
</script>