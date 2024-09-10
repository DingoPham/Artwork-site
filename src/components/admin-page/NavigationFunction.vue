<template>
    <div>
        <button @click="addImage">Insert</button>
        <button @click="updateImage(image)">Update</button>
        <button @click="deleteImage(image.id)">Delete</button>
    </div>
</template>

<script>
    export default{
        components:{},
        methods:{
            addImage: function(){},
            updateImage: function(){},
            deleteImage: function(){},
        }
    }
</script>