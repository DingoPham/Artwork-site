<template>
    <div class="authen-bg-main flex justify-center items-center body-page">
        <PopupNotification  v-if="showPopupNotify" 
                            :registerMessage="popupMessage"
                            @hide="onPopupHide"/>
        <div class="bg-w">
            <h2 class="tx-center"> Register </h2>
            <div class="authen-box flex flex-column items-center gap">
                <form @submit.prevent="register" class="flex flex-column gap-10">
                    <label for="email">Email</label>
                    <input v-model="email" placeholder="Email" type="email"/>

                    <label for="username"> Username </label>
                    <input v-model="username" placeholder="Username" maxlength="20"/>

                    <label for="password"> Password </label>
                    <div class="flex items-center justify-end">
                        <input :type="showPassword ? 'text' : 'password'" 
                            v-model="password" 
                            placeholder="Password"
                            maxlength="20"
                            />
                        <i @click="visiblePass" class="flex "
                            :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'">
                        </i>
                    </div>

                    <label for="age">Age</label>
                    <input v-model="age" placeholder="Age" type="date"/>
                    
                    <div class="justify-center flex">
                        <button type="submit" >Register</button>
                    </div>
                    
                    <label for="/">Already have an account?
                        <router-link to="/login">
                            Login
                        </router-link>
                    </label>

                    <input v-model="role" id="role" hidden disabled/> <!-- Hidden role function.... -->
                </form> 
            </div>
        </div>
    </div>
</template>

<script>
import PopupNotification from '../admin-page/other-admin-fuction/PopupNotification.vue';

    export default{
        components:{PopupNotification},
        name: 'register',
        data() {
            return {
                email: '',
                username: '',
                password: '',
                age: '',
                role: 'user',
                showPassword: false,
                showPopupNotify: false,
                popupMessage: '',
            };
        },
        methods:{
            visiblePass(){
                this.showPassword = !this.showPassword;
            },
            async register(){   
                try{
                    if(!this.email || !this.username || !this.password || !this.age){
                        this.popupMessage = 'Please fill in all the required fields'
                        this.showPopupNotify = true;
                        return;
                    }
                    const response = await fetch('https://artwork-core-for-render-build.onrender.com/Authentication/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            Email: this.email,
                            Username: this.username,
                            Password: this.password,
                            Age: this.age,
                            Role: this.role
                        })
                    });
                    if (!response.ok){
                        throw new Error("Network response wasn't ok");
                    }

                    const result = await response.json();
                    console.log('API response: ', result);

                    if (result.registerMessage === 'Registration Successful!'){
                        this.popupMessage = 'Registration Successful!';
                    }
                    else{
                        this.popupMessage = 'Registration Failed...';
                    }
                    this.showPopupNotify = true;
                }
                catch(error){
                    this.popupMessage = "Registration Failed...";
                    this.showPopupNotify = true;
                }
            },
            onPopupHide(){
                if(this.popupMessage === 'Registration Successful!'){
                    this.$router.push({path: "/login"});
                }
                else{
                    this.showPopupNotify = false;
                }
            }
        }
    }
</script>