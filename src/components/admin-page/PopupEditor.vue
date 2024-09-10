<template>
    <div>
        <button @click="showPopup = true">Insert</button>
        <div v-if="showPopup" class="po-fixed po-fixed-mod bg-c-popup flex justify-center items-center">
            <div class="bg-c-white p-1 border-radius-5 h-500 w-800">
                <h1>{{ editMode ? 'Update image' : 'Insert image' }}</h1>

                <form @submit.prevent="saveImage" class="flex flex-column gap">
                    <label for="img-type">Select category:</label>
                    <select v-model="imgType" id="img-type">
                        <option value="sfw_art">SFW Art</option>
                        <option value="nsfw_art">NSFW Art</option>
                    </select>
                    <label for="img-url">URL's image: </label>
                    <input v-model="imgUrl" id="img-url" type="text" placeholder="Type image's URL here">

                    <label for="img-name">Image name: </label>
                    <input v-model="imgName" id="img-name" type="text" placeholder="Type image's name here">

                    <label for="img-des">Image describe: </label>
                    <input v-model="imgDescribe" id="img-des" type="text" placeholder="Type image's describe here">

                    <div class="flex flex-column gap-10 items-end  ">
                        <button type="submit" class="w-60 h-30">{{ editMode ? 'Update' : 'Insert' }}</button>
                        <button type="button" @click="closePopup" class="w-60 h-30">Cancle</button>
                    </div>
                </form>
            </div>
        </div>

        <div v-for="(image, index) in images" :key="image.id" class="m-t-5"> 
            <img :src="image.imgUrl" alt=""/>
            <p>{{ image.iName }}</p>
            <p>{{ image.describe }}</p>
            <button @click="updateImage(index)">Update</button>
            <button @click="deleteImage(image.id)">Delete</button>
        </div>
    </div>
</template>

<script>
    export default{
        components:{

        },
        data(){
            return{
                showPopup: false,
                editMode: false,
                imgType: 'sfw_art', //Default type
                imgUrl: '',
                imgName: '',
                imgDescribe: '',
                editIndex: null,
                images: []
            };
        },
        created(){
            this.fetchImages();
        },
        methods:{
            closePopup(){
                this.showPopup = false;
                this.imgUrl = '';
                this.imgName = '';
                this.imgDescribe = '';
                this.imgType = 'sfw_art'; // reset to default
                this.editMode = false;
                this.editIndex = null;
            },

            fetchImages(){
                fetch('https://localhost:7064/ArtworkCombine')
                .then(response => response.json())
                .then(data => {
                    this.images = [...data.list_data_sfwart, ...data.list_data_nsfwart]
                })
                .catch(error => {
                console.error('Can not get any images, error:', error);
                });
            },

            saveImage(){
                const imgData = {
                    imgUrl: this.imgUrl,
                    iName: this.imgName,
                    describe: this.imgDescribe
                };

                console.log("Data test:", imgData);

                const type = this.imgType; // selected type

                if (this.editMode){
                    fetch(`https://localhost:7064/ArtworkCombine/${this.images[this.editIndex].id}`,{
                        method: 'PUT',
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({Type: type, Data: imgData})
                    })
                    .then(response => response.json())
                    .then(() => {
                        this.images[this.editIndex] = imgData;
                        this.closePopup();
                    })
                    .catch(error => {
                        console.error('Error while updating image: ', error);
                    });
                }
                else{
                    fetch('https://localhost:7064/ArtworkCombine/post',{
                        method: 'POST',
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({Type: type, Data: imgData})
                    })
                    .then(response => response.json())
                    .then(newImage => {
                        this.images.push(newImage);
                        this.closePopup();
                    })
                    .catch(error =>{
                        console.error('Error while inserting image: ', error)
                    });
                }
            },
            updateImage(index){
                this.editMode = true;
                this.showPopup = true;
                this.editIndex = index;
                this.imgType = this.images[index].imgType || 'sfw_art'; //add type for pre-fill
                this.imgUrl = this.images[index].imgUrl;
                this.imgName = this.images[index].iName;
                this.imgDescribe = this.images[index].describe;
            },
            deleteImage(id){
                const type = this.images.find(image => image.id === id).imgType || 'sfw_art';
                fetch('https://localhost:7064/ArtworkCombine/del/', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ Type: type, Data: {id} })
                })
                .then(() =>{
                    this.images = this.images.filter(image => image.id !== id);
                })
                .catch(error => {
                    console.error('Error while deleting image: ', error);
                });
            }
        }
    }
</script>