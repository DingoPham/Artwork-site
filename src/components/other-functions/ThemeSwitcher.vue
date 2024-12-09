<template>
    <div class="cursor">
        <button @click="toggleTheme">
            <component :is="theme === 'light' ? 'DarkButton' : 'LightButton'" />
        </button>
    </div>
</template>

<script>
import DarkButton from './button-container/DarkButton.vue'
import LightButton from './button-container/LightButton.vue'

export default{
    components:{
        DarkButton, LightButton
    },
    data() {
        return {
        theme: localStorage.getItem('theme') || 'light', // Lấy theme từ localStorage hoặc mặc định là 'light'
        };
    },
    watch: {
        theme(newTheme) {
            document.body.className = newTheme; // Gán class theme vào body
            localStorage.setItem('theme', newTheme); // Lưu theme vào localStorage
        },
    },
    methods: {
        toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light'; // Chuyển đổi theme
        },
    },
    mounted() {
        document.body.className = this.theme; // Áp dụng theme hiện tại vào body khi component được mount
    },
}
</script>