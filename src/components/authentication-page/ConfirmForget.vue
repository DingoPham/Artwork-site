<template>
    <div class="authen-bg-main flex justify-center items-center">
        <div class="bg-w">
            <h2 class="tx-center"> Reset Password </h2>
            <div class="authen-box flex flex-column items-center gap">
                <form @submit.prevent="login" class="flex flex-column gap-10">
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
                            v-model="password"
                            placeholder="Confirm Password"
                            maxlength="20"
                            />
                        <i @click="visibleConfirmPass"
                            :class="showConfirmPassword ? 'fa fa-eye-slash' : 'fa fa-eye'">
                        </i>
                    </div>
                    <select v-model="role" id="role" disabled hidden></select>
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
export default{
    name: 'reset-password',
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
        async resetPasswod(){
            if(this.password !== this.confirmPassword){
                return;
            }
            
            const urlParam = new URLSearchParams(window.location.search);
            const token = urlParam.get('token');

            if(!token){
                return;
            }
        }
    }
}
</script>