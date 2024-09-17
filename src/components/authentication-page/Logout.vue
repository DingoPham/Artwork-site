<template>
    <div>
        <button @click="logout">Log out</button>
    </div>
</template>

<script>
    export default{
        methods:{
            logout(){
            localStorage.removeItem('token');
            this.$emit('logged-out');
            this.$router.push({path: "/login"})
            }
        }
    }
</script>

<style scoped>
    button{
        cursor: pointer;
        box-sizing: unset;
        background-color: #3a3a3a;
        color: #fff;
        width: 70px;
        height: 30px;
        border-radius: 3px;
    }
    button:active{
        transform: scale(0.95);
    }
</style>