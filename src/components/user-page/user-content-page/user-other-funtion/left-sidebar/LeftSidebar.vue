<template>
    <div class="sidebar po-fixed h-100p w-300px" :class="{ active: isActive}">
        <div class="p-3 m-t flex flex-column gap">
            <p class="f-30">Support me</p>
            <a class="f-25 m-l" href="https://www.youtube.com/channel/UCtH0_zKVeXOKO2hiqLoHSrg">Follow my Youtube!</a>
            <a class="f-25 m-l" href="https://buymeacoffee.com/dingopham763/membership">Buy me a coffee!</a>
            <p class="f-30">My Blog</p>
            <a class="f-25 m-l" href="https://dingopham.github.io/">Dingo's Blog</a>
        </div>
    </div>
</template>

<script>
    export default{
        name: 'LeftNavbar',
        props:{
            isActive:{
                type: Boolean,
                default: false
            }
        }
    }
</script>