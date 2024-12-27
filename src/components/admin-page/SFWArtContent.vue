<template>
    <div class="m-t-20">
        <div class="flex justify-center">
            <button v-if="userRole === 'admin'" @click="showPopup = true" class="button-f">Insert</button>
        </div>
        <div v-if="showPopup" class="po-fixed po-fixed-mod bg-c-popup flex justify-center items-center">
            <div class="bg-c-white p-1 border-radius-5 h-500 w-800">
                <h1>{{ editMode ? 'Update image' : 'Insert image' }}</h1>

                <form @submit.prevent="saveImage" class="flex flex-column gap">
                    <label for="img-type" class="f-20 bold">- Safe For Work Art -</label>
                    <input v-model="imgType" id="img-type" disabled hidden>
                    
                    <label for="img-url">URL's image: </label>
                    <input v-model="imgUrl" id="img-url" type="text" placeholder="Type image's URL here">

                    <label for="img-name">Image name: </label>
                    <input v-model="imgName" id="img-name" type="text" placeholder="Type image's name here">

                    <label for="img-des">Image describe: </label>
                    <input v-model="imgDescribe" id="img-des" type="text" placeholder="Type image's describe here">

                    <div class="flex flex-column gap-10 items-end">
                        <button type="submit" class="button-f">{{ editMode ? 'Update' : 'Insert' }}</button>
                        <button type="button" class="button-f" @click="closePopup">Cancle</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="flex m-t-20 over-hidden gap-18 flex-wrap justify-center-2">
            <div v-for="(image, index) in paginatedImages" :key="image.id" class="m-t-20 gap-5 img-slice"> 
                <div class="flex gap-10 m-b">
                    <button v-if="userRole === 'admin'" @click="updateImage(index)" class="button-f">Update</button>
                    <button v-if="userRole === 'admin'" @click="deleteImage(image.id)" class="button-f">Delete</button>
                </div>
                <img :src="image.imgUrl" alt="" @click="showFullImage(image)" class="img"/>
                <p>{{ image.imgName }}</p>
                <p>{{ image.describe }}</p>
            </div>
        </div>
        

        <div v-if="showImagePopup" class="po-fixed po-fixed-mod bg-c-popup flex justify-center items-center">
            <div class="div">
                <img :src="curruntImage.imgUrl" alt="">
                <div @click="showImagePopup = false">
                    <i style="font-size:24px" class="fa">&#xf00d;</i>
                </div>
            </div>
        </div>
        
        <PageChanger
            v-if="images.length > 0"
            :totalPages = "totalPages"
            :curruntPage = "curruntPage"
            @page-change="changePage"
        />
    </div>
</template>

<script>
    import PageChanger from "../admin-page/other-admin-fuction/PageChanger.vue"

    export default{
        components:{PageChanger},
        data(){
            return{
                showPopup: false,
                editMode: false,
                imgType: 'sfw_art', // type
                imgUrl: '',
                imgName: '',
                imgDescribe: '',
                editIndex: null,
                images: [],
                userRole: '', // track role
                curruntPage: 1,
                itemsPerPage: 6,
                showImagePopup: false,
                curruntImage: null,
            };
        },
        computed:{
            totalPages(){
                return Math.ceil(this.images.length / this.itemsPerPage);
            },
            paginatedImages(){
                const start = (this.curruntPage - 1) * this.itemsPerPage;
                return this.images.slice(start, start + this.itemsPerPage);
            }
        },
        created(){
            this.fetchImages();
            this.checkUserRole();
        },
        methods:{
            showFullImage(image){
                this.curruntImage = image;
                this.showImagePopup = true;
            },
            changePage(page){
                this.curruntPage = page;    
            },
            checkUserRole(){
                const role = localStorage.getItem('role');
                if(role){
                    this.userRole = role;
                    return;
                }

                const token = localStorage.getItem('token');
                if(!token){
                    this.userRole = 'guest'; // default role for unknow user
                    return;
                }
                const tokenParts = token.split('.');
                if(tokenParts.length !== 3){
                    console.error('Token format is incorrect');
                    this.userRole = 'guest';
                    return;
                }
                try{
                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    this.userRole = decodedToken.role;    
                }
                catch(error){
                    console.error('Error decoding token: ', error);
                    this.userRole = 'guest'; // fix the error of not found user
                }
            },
            closePopup(){
                this.showPopup = false;
                this.imgUrl = '';
                this.imgName = '';
                this.imgDescribe = '';
                this.imgType = 'sfw_art'; // close popup with this type
                this.editMode = false;
                this.editIndex = null;
            },

            fetchImages(){
                fetch('https://dingo.bigcat.id.vn/SFW')
                .then(response => response.json())
                .then(data => {
                    this.images = [...data.list_data_sfwart]
                })
                .catch(error => {
                console.error('Can not get any images, error:', error);
                });
            },

            saveImage(){
                const imgData = {
                    imgUrl: this.imgUrl,
                    imgName: this.imgName,
                    describe: this.imgDescribe
                };

                console.log("Data test:", imgData);

                const type = this.imgType; // selected type
                const token = localStorage.getItem('token'); // get token from local storage

                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // add token to header
                };

                if (this.editMode){
                    fetch(`https://dingo.bigcat.id.vn/SFW/put/${this.images[this.editIndex].id}`,{
                        method: 'PUT',
                        headers: headers,
                        body: JSON.stringify({Type: type, Data: imgData})
                    })
                    .then(response => response.json())
                    .then(() => {
                        this.images[this.editIndex] = {imgData};
                        this.closePopup();
                    })
                    .catch(error => {
                        console.error('Error while updating image: ', error);
                    });
                }
                else{
                    fetch('https://dingo.bigcat.id.vn/SFW/post',{
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({Type: type, Data: imgData})
                    })
                    .then(response => {
                        if(!response.ok){
                            return response.json().then(err => {
                                throw new Error(err.message);
                            });
                        }
                        return response.json();
                    })
                    .then(newImage => {
                        this.images.push({
                            id: newImage.id,
                            ...imgData
                        });
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
                this.imgName = this.images[index].imgName;
                this.imgDescribe = this.images[index].describe;
            },
            deleteImage(id){
                const type = this.images.find(image => image.id === id).imgType || 'sfw_art';
                const token = localStorage.getItem('token');

                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // add token to header
                };

                fetch('https://dingo.bigcat.id.vn/SFW/del/', {
                    method: 'DELETE',
                    headers: headers,
                    body: JSON.stringify({ Type: type, Data: {id} })
                })
                .then(() =>{
                    this.images = this.images.filter(image => image.id !== id);
                })
                .catch(error => {
                    console.error('Error while deleting image: ', error);
                });
            },
        }
    }
</script>