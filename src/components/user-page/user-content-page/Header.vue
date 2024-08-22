<template>
    <div>
        <div class="navbar w-100p h-60px flex justify-center items-center">
            <div class="f-30">
                <router-link active-class="a-c"to = '/'> Artwork </router-link>
            </div>
            <LeftNavbar />
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import LeftNavbar from './user-other-funtion/LeftNavbar.vue';

export default{
    name: 'Header',
    components:{LeftNavbar}
}
</script>