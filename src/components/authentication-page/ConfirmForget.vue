<template>
    <div class="authen-bg-main flex justify-center items-center">
        <PopupNotification  v-if="showPopupNotify" 
                            :resetMessage="popupMessage"
                            @hide="onPopupHide"/>
        <div class="bg-w">
            <h2 class="tx-center"> Reset Password </h2>
            <div class="authen-box flex flex-column items-center gap">
                <form @submit.prevent="confirm" class="flex flex-column gap-10">
                    <label for="password">New Password </label>
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
                    <label for="confirmPassword"> Confirm New Password </label>
                    <div class="flex items-center justify-end">
                        <input :type="showConfirmPassword ? 'text' : 'password'" 
                            v-model="confirmPassword"
                            placeholder="Confirm Password"
                            maxlength="20"
                            />
                        <i @click="visibleConfirmPass"
                            :class="showConfirmPassword ? 'fa fa-eye-slash' : 'fa fa-eye'">
                        </i>
                    </div>
                    <div class="justify-center flex">
                        <button type="submit" >Submit</button>
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
    name: 'reset-password',
    components:{PopupNotification},
    data(){
        return{
            password: '',
            confirmPassword: '',
            showPassword: false,
            showConfirmPassword: false,
            showPopupNotify: false,
            popupMessage: '',
        };
    },
    methods:{
        visiblePass(){
            this.showPassword = !this.showPassword;
        },
        visibleConfirmPass(){
            this.showConfirmPassword = !this.showConfirmPassword
        },
        async confirm(){
            try{
                if(!this.password || !this.confirmPassword){
                    this.popupMessage = 'Please fill in all the required fields'
                    this.showPopupNotify = true;
                    return;
                }

                if (this.password !== this.confirmPassword){
                    this.popupMessage = 'Password do not match!'
                    this.showPopupNotify = true;
                    return;
                }

                const urlParam = new URLSearchParams(window.location.search);
                const token = urlParam.get('token');

                if(!token){ 
                    console.log("Invalid or missing token");
                    return;
                }

                const response = await fetch('https://localhost:7064/ArtworkCombine/reset-password', {
                        method: 'POST',
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ 
                            token: token,
                            newPassword: this.password
                    })
                });

                const result = await response.json();
                console.log("API response: ", result);

                if(result.resetMessage === 'Password successful reset!'){
                    this.popupMessage = 'Password successful reset!';
                }
                else{
                    this.popupMessage = 'Password reset failed';
                }
                this.showPopupNotify = true;
                }
            catch(error){
                this.popupMessage = 'Password reset failed';
                this.showPopupNotify = true;
            }
        },
        onPopupHide(){
            this.showPopupNotify = false;
        },
    }
}
</script>