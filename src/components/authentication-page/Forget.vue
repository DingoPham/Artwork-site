<template>
    <div class="authen-bg-main flex justify-center items-center">
        <div class="bg-w">
            <h2 class="tx-center"> Forgot account </h2>
            <div class="authen-box flex flex-column items-center gap">
                <form @submit.prevent="login" class="flex flex-column gap-10">
                    <label for="email"> Email </label>
                    <input v-model="email" placeholder="Email" />
                    
                    <div class="justify-center flex">
                        <button type="submit" >Submit</button>
                    </div>
                    
                    <label for="/">Remember your account?
                        <router-link to="/login">Sign in</router-link>
                    </label>
                    <label for="/">
                        <router-link to="/register">Or don't have an account yet...</router-link>
                    </label>
                </form> 
                <label for="/" class="note">
                        Note: After clicking "Submit", you need to open your mail-box to check and agree to recover your account ...
                </label>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        name: 'forget-password',
        data(){
            return {
                email: ''
            }
        },
        methods:{
            async forgotPassword() {
                try {
                    const response = await fetch('https://localhost:7064/ArtworkCombine/forget-password', {
                        method: 'POST',
                        headers:{
                            'Content-Type': 'Application/json'
                        },
                        body:{
                            Email: this.email
                        }
                    });
                    const result = await response.json();
                    alert(result.message);
                } 
                catch (error) {
                    alert('Failed to send password reset instructions');
                }
            }
        }
    }
</script>