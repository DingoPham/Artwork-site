<template>
    <div class="authen-bg-main flex justify-center items-center">
        <PopupNotification  v-if="showPopupNotify" 
                            :loginMessage="popupMessage"
                            @hide="onPopupHide"/>
        <div class="bg-w">
            <h2 class="tx-center"> Login </h2>
            <div class="authen-box flex flex-column items-center gap">
                <form @submit.prevent="login" class="flex flex-column gap-10">
                    <label for="username"> Username </label>
                    <input v-model="username" placeholder="Username" maxlength="20"/>
                    <label for="password"> Password </label>
                    <div class="flex items-center justify-end">
                        <input :type="showPassword ? 'text' : 'password'" 
                            v-model="password"
                            placeholder="Password"
                            maxlength="20"
                            />
                        <i @click="visiblePass"
                            :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'">
                        </i>
                    </div>
                    <select v-model="role" id="role" disabled hidden></select>
                    <div class="justify-center flex">
                        <button type="submit" >Login</button>
                    </div>
                    
                    <label for="/">Don't have an account?
                        <router-link to="/register">Sign up</router-link>
                    </label>
                    <label for="/">
                        <router-link to="/forget-password">Forgot account?</router-link>
                    </label>
                </form> 
            </div>
        </div>
    </div>
</template>

<script>
import PopupNotification from '../admin-page/other-admin-fuction/PopupNotification.vue';

    export default{
        name: 'login',
        components:{PopupNotification},
        data(){
            return{
                username: '',
                password: '',
                role: '',
                showPassword: false,
                showPopupNotify: false,
                popupMessage: '',
            };
        },
        methods:{
            visiblePass(){
                this.showPassword = !this.showPassword;
            },
            async login(){
                try{
                    if(!this.username || !this.password){
                        this.popupMessage = 'Please fill in all the required fields'
                        this.showPopupNotify = true;
                        return;
                    }

                    const response = await fetch('https://dingo.bigcat.id.vn/Authentication/login', {
                        method: 'POST',
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            Username: this.username,
                            Password: this.password,
                            Role: this.role
                        })
                    });
                    
                    if (!response.ok){
                        throw new Error("Network response wasn't ok");
                    }

                    const result = await response.json();
                    console.log("API response: ", result);

                    if (result.loginMessage === 'Login Successful!'){
                        localStorage.setItem('token', result.token);
                        localStorage.setItem('username', result.username);
                        localStorage.setItem('role', result.role);
                        this.popupMessage = 'Login Successful!';
                    }
                    else{
                        this.popupMessage = 'Incorrect username or password';
                    }
                    this.showPopupNotify = true;
                }
                catch(error){
                    this.popupMessage = "Incorrect username or password";
                    this.showPopupNotify = true
                }
            },
            onPopupHide(){
                if(this.popupMessage === 'Login Successful!'){
                    this.$router.push({path: "/"});
                }
                else{
                    this.showPopupNotify = false;
                }
            }
        }
    };
</script>