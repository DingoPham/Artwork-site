<template>
    <div class="position-fixed fu-con fu-con-box p-1">   
        <div class="flex flex-column items-center gap-10">
            <ThemeSwitcher />
        </div>
    </div>
</template>

<script>
import ThemeSwitcher from './ThemeSwitcher.vue';

export default{
    components:{
        ThemeSwitcher
    }
}

</script>