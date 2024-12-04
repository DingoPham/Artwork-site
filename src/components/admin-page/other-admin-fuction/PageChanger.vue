<template>
    <div>
        <div class="flex flex-column">
            <div class="flex justify-center gap pc m-t-b">
                <button @click="prevPage" :disabled="curruntPage === 1"> 
                    <span>&#8592;</span>
                </button>
                <input v-model="pageInput" @keydown.enter="goToPage" type="number" :min="1" :max="totalPages"/>
                <button @click="nextPage" :disabled="curruntPage === totalPages"> 
                    <span>&#8594;</span>
                </button>
            </div>
        </div>
    </div>    
</template>

<script>
    export default{
        props:{
            totalPages:{
                type: Number,
                required: true
            },
            curruntPage:{
                type: Number,
                required: true
            }
        },
        watch:{
            curruntPage(newPage){
                this.pageInput = newPage;
            }
        },
        data(){
            return{
                pageInput: this.curruntPage
            };
        },
        methods:{
            prevPage(){
                if(this.curruntPage > 1){
                    this.$emit('page-change', this.curruntPage - 1);
                }
            },
            nextPage(){
                if(this.curruntPage < this.totalPages){
                    this.$emit('page-change', this.curruntPage + 1);
                }
            },
            goToPage(){
                const page = parseInt(this.pageInput);
                if(page >= 1 && page <= this.totalPages ){
                    this.$emit('page-change', page);
                }
                else{
                    alert('Page number is out of range');
                }
            }
        }
    }
</script>

<style scoped>
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type="number"] {
        -moz-appearance: textfield;
    }
</style>