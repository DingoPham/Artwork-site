<template>
    <div class="authen-bg-main flex justify-center items-center">
        <PopupNotification  v-if="showPopupNotify" 
                            :forgetMessage="popupMessage"
                            @hide="onPopupHide"/>
        <div class="bg-w">
            <h2 class="tx-center"> Forgot account </h2>
            <div class="authen-box flex flex-column items-center gap">
                <form @submit.prevent="forget" class="flex flex-column gap-10">
                    <label for="email"> Email </label>
                    <input v-model="email" placeholder="Email" />
                    
                    <div class="justify-center flex">
                        <button type="submit" >Submit</button>
                    </div>
                    
                    <label for="/">Remember your account?
                        <router-link to="/login">Login</router-link>
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
import PopupNotification from '../admin-page/other-admin-fuction/PopupNotification.vue';

    export default{
        components:{PopupNotification},
        name: 'forget-password',
        data(){
            return {
                email: '',
                showPopupNotify: false,
                popupMessage: '',
            };
        },
        methods:{
            async forget() {
                try {
                    if(!this.email){
                        this.popupMessage = 'Please fill in all the required fields'
                        this.showPopupNotify = true;
                        return;
                    }

                    const response = await fetch('https://dingo.bigcat.id.vn/Authentication/forget-password', {
                        method: 'POST',
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ 
                            Email: this.email,
                        })
                    });

                    if (!response.ok){
                        throw new Error("Network response wasn't ok");
                    }

                    const result = await response.json();
                    console.log("API Response: ", result);

                    if(result.forgetMessage === 'Recovery notification sent'){
                        this.popupMessage = 'Recovery notification sent';
                    }
                    else{
                        this.popupMessage = 'Failed to send recovery information';
                    }
                    this.showPopupNotify = true;
                } 
                catch (error) {
                    this.popupMessage = 'Failed to send recovery information';
                    this.showPopupNotify = true;
                }
            },
            onPopupHide(){
                this.showPopupNotify = false;
            },
        }
    }
</script>