<template>
    <div>
        <div v-if="show" class="po-fixed flex justify-center items-center bg-all">
            <div class="box-white">
                <div class="login">
                    <h1>{{ loginMessage }}</h1>
                    <img v-if="loginMessage === 'Login Successful!'" src="../../../assets/Approved.gif" alt="" class="icon">
                    <img v-if="loginMessage === 'Incorrect username or password'" src="../../../assets/Denined.gif" alt="" class="icon"/>
                    <img v-if="loginMessage === 'Please fill in all the required fields'" src="../../../assets/Warning.gif" alt="" class="icon">
                </div>
                <div class="register">
                    <h1>{{ registerMessage }}</h1>
                    <img v-if="registerMessage === 'Registration Successful!'" src="../../../assets/Approved.gif" alt="" class="icon">
                    <img v-if="registerMessage === 'Registration Failed...'" src="../../../assets/Denined.gif" alt="" class="icon"/>
                    <img v-if="registerMessage === 'Please fill in all the required fields'" src="../../../assets/Warning.gif" alt="" class="icon">
                </div>
                <div class="forget">
                    <h1>{{ forgetMessage }}</h1>
                    <img v-if="forgetMessage === 'Recovery notification sent'" src="../../../assets/Approved.gif" alt="" class="icon">
                    <img v-if="forgetMessage === 'Failed to send recovery information'" src="../../../assets/Denined.gif" alt="" class="icon"/>
                    <img v-if="forgetMessage === 'Please fill in all the required fields'" src="../../../assets/Warning.gif" alt="" class="icon">
                </div>
                <div class="confirm-forget">
                    <h1>{{ resetMessage }}</h1>
                    <img v-if="resetMessage === 'Password successful reset!'" src="../../../assets/Approved.gif" alt="" class="icon">
                    <img v-if="resetMessage === 'Password reset failed'" src="../../../assets/Denined.gif" alt="" class="icon"/>
                    <img v-if="resetMessage === 'Please fill in all the required fields'" src="../../../assets/Warning.gif" alt="" class="icon">
                    <img v-if="resetMessage === 'Password do not match!'" src="../../../assets/Warning.gif" alt="" class="icon">
                    <img v-if="resetMessage === 'Invalid or expired token'" src="../../../assets/Warning.gif" alt="" class="icon">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default{
    props:['loginMessage','registerMessage','forgetMessage','resetMessage'],
    data(){
        return{
            show: true,
        };
    },
    mounted(){
        setTimeout(() => {
            this.showPopup = false;
            this.$emit('hide');
        }, 2000);
    },
};
</script>

<style scoped>
   .box-white{
        display: flex;
        padding: 10px;
        height: 300px;
        border-radius: 4px;
        animation: boxChange 0.5s ease forwards;
    }
    .login, .register, .forget, .confirm-forget, .nsfw-content{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .box-white h1{
        animation: wordChange 0.5s ease forwards;
        font-size: 40px;
        font-weight: 300;
    }
    .icon{
        width: 150px;
        height: 150px;
        opacity: 1;
        transition: opacity 2s ease;
    }
    .icon.show{
        opacity: 1;
    }
    .bg-all{
        height: 100%;
        width: 100%;
        animation: bgChange 0.5s ease forwards;
    }
    @keyframes wordChange{
        0%{
            color: #fff;
        }
        100%{
            color: #000;
        }
    }
    @keyframes boxChange{
        0%{
            background-color: none;
        }
        100%{
            background-color: #fff;
        }
    }
    @keyframes bgChange{
        0%{
            background-color: none;
        }
        100%{
            background-color: #2b2b2bc0;
        }
    }
/* -------------------------------------- */
    @media (max-width: 768px) {
        .box-white h1{
            font-size: 25px;
            font-weight: 300;
        }
    }
</style>