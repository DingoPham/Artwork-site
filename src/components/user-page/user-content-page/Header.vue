<template>
    <div>
        <div class="navbar w-100p h-60px flex items-center justify-center">
                <div class="f-30">
                    <router-link active-class="a-c"to = '/'> Artwork </router-link>
                </div>
                <router-view></router-view>
        </div>
        <div class="po-rel">
            <LeftSidebarContent :isActive="isSidebarActive" @toggle-sidebar = "toggleSidebar" />
        </div>
        <LeftSidebar :isActive="isSidebarActive" />
    </div>
</template>

<script>
import LeftSidebar from './user-other-funtion/left-sidebar/LeftSidebar.vue';
import LeftSidebarContent from './user-other-funtion/left-sidebar/LeftSidebarContent.vue';

export default{
    name: 'Header',
    components:{LeftSidebar, LeftSidebarContent},
    data(){
        return{
            isSidebarActive: false
        };
    },
    methods:{
        toggleSidebar(){
            this.isSidebarActive = !this.isSidebarActive
        }
    }
}
</script>