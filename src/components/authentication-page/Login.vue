<template>
    <div class="authen-bg-main flex justify-center items-center">
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
    export default{
        name: 'login',
        data(){
            return{
                username: '',
                password: '',
                showPassword: false,
            };
        },
        methods:{
            visiblePass(){
                this.showPassword = !this.showPassword;
            },
            async login(){
                try{
                    const response = await fetch('https://localhost:7064/ArtworkCombine/login', {
                        method: 'POST',
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            Username: this.username,
                            Password: this.password
                        })
                    });
                    if (!response.ok){
                        throw new Error("Network response wasn't ok");
                    }

                    const result = await response.json();
                    console.log("API response: ", result);
                    alert(result.message);

                    if (result.message === 'Login successful!'){
                        localStorage.setItem('token', result.token);
                        this.$router.push({path: "/"});
                    }
                }
                catch(error){
                    console.log('Login failed: ', error)
                    alert('Login failed');
                }
            }
        }
    };
</script>