<template>
    <div>
        <div v-if="show" class="po-fixed flex justify-center items-center bg-all">
            <div class="box-white ">
                <h1>{{ message }}</h1>
                <img src="../../../assets/Approved.gif" alt="" class="approved">
            </div>
        </div>
    </div>
</template>

<script>
export default{
    props:['message'],
    data(){
        return{
            show: true
        };
    },
    mounted(){
        setTimeout(() => {
            this.showPopup = false;
            this.$emit('hide');
        }, 2000);
    },
};
</script>

<style scoped>
    .box-white h1{
        font-size: 40px;
        font-weight: 300;
        animation: wordChange 0.5s ease forwards;
    }
    .approved{
        width: 150px;
        height: 150px;
        opacity: 1;
        transition: opacity 2s ease;
    }
    .approved.show{
        opacity: 1;
    }
    .bg-all{
        height: 100%;
        width: 100%;
        animation: bgChange 0.5s ease forwards;
    }
    .box-white{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px;
        height: 300px;
        border-radius: 4px;
        animation: boxChange 0.5s ease forwards;
    }
    @keyframes wordChange{
        0%{
            color: #fff;
        }
        100%{
            color: #000;
        }
    }
    @keyframes boxChange{
        0%{
            background-color: none;
        }
        100%{
            background-color: #fff;
        }
    }
    @keyframes bgChange{
        0%{
            background-color: none;
        }
        100%{
            background-color: #2b2b2bc0;
        }
    }
</style>