<template>
    <div class="m-t-20">
        <Loader v-if="isLoading" />
        <div v-else>
            <div class="flex justify-center">
                <button v-if="userRole === 'admin'" @click="showPopup = true" class="button-f">Insert</button>
            </div>
            <div v-if="showPopup" class="po-fixed po-fixed-mod bg-c-popup flex justify-center items-center">
                <div class="bg-c-white c-black p-1 border-radius-5 h-500 w-800">
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
                    <button type="button" class="button-f" @click="closePopup">Cancel</button>
                    </div>
                </form>
                </div>
            </div>

            <div class="flex m-t-20 over-hidden gap-18 flex-wrap justify-center-2">
                <div v-for="(image, index) in paginatedImages" :key="image.id" class="m-t-20 gap-5 img-slice">
                <div class="flex gap-10 m-b">
                    <button v-if="userRole === 'admin'" @click="updateImage(index)" class="button-f">Update</button>
                    <button v-if="userRole === 'admin'" @click="deleteImage(image.id)" class="button-f">Delete</button>
                    <button v-if="userRole === 'admin'" @click="moveImageLeft(index)" class="button-f2">
                        <span>&#8592;</span>
                    </button>
                    <button v-if="userRole === 'admin'" @click="moveImageRight(index)" class="button-f2">
                        <span>&#8594;</span>
                    </button>
                </div>
                <img :src="image.imgUrl" alt="" @click="showFullImage(image)" class="img" />
                <p>{{ image.imgName }}</p>
                <p>{{ image.describe }}</p>
                </div>
            </div>

            <div v-if="showImagePopup" class="po-fixed po-fixed-mod bg-c-popup flex justify-center items-center">
                <div class="div">
                <img :src="curruntImage.imgUrl" alt="">
                <div @click="showImagePopup = false">
                    <i style="font-size:24px" class="fa"></i>
                </div>
                </div>
            </div>

            <PageChanger
                v-if="images.length > 0"
                :totalPages="totalPages"
                :curruntPage="curruntPage"
                @page-change="changePage"
            />
        </div>
    </div>
</template>

<script>
    import PageChanger from "../admin-page/other-admin-fuction/PageChanger.vue"
    import Loader from "../other-functions/Loader.vue";
    
    export default{
        components:{PageChanger, Loader},
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
                isLoading: false,
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

            async fetchImages(){
                this.isLoading = true;
                try{
                    const response = await fetch('https://artwork-core-for-render-build.onrender.com/SFW');
                    const data = await response.json();
                    this.images = [...data.list_data_sfwart];
                }
                catch(error){
                    console.error('Can not get any images, error:', error);
                }
                finally{
                    this.isLoading = false;
                }
            },

            async saveImage() {
                this.isLoading = true;
                const imgData = {
                    imgUrl: this.imgUrl,
                    imgName: this.imgName,
                    describe: this.imgDescribe
                };
                const type = this.imgType;
                const token = localStorage.getItem('token');
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };
                try {
                    if (this.editMode) {
                    const globalIndex = this.editIndex; // Sử dụng editIndex toàn cục
                    const response = await fetch(`https://artwork-core-for-render-build.onrender.com/SFW/put/${this.images[globalIndex].id}`, {
                        method: 'PUT',
                        headers: headers,
                        body: JSON.stringify({ Type: type, Data: imgData })
                    });
                    if (!response.ok) {
                        const err = await response.json();
                        throw new Error(err.message);
                    }
                    await response.json();
                    // Cập nhật ảnh tại vị trí toàn cục
                    this.images[globalIndex] = { ...this.images[globalIndex], ...imgData };
                    this.closePopup();
                    } else {
                    const response = await fetch('https://artwork-core-for-render-build.onrender.com/SFW/post', {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({ Type: type, Data: imgData })
                    });
                    if (!response.ok) {
                        const err = await response.json();
                        throw new Error(err.message);
                    }
                    const newImage = await response.json();
                    this.images.push({
                        id: newImage.id,
                        ...imgData
                    });
                    this.closePopup();
                    }
                } catch (error) {
                    console.error(`Error while ${this.editMode ? 'updating' : 'inserting'} image: `, error);
                } finally {
                    this.isLoading = false;
                }
            },
            updateImage(index){
                this.editMode = true;
                this.showPopup = true;
                const start = (this.curruntPage - 1) * this.itemsPerPage;
                this.editIndex = start + index;
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

                fetch('https://artwork-core-for-render-build.onrender.com/SFW/del/', {
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
            async moveImageLeft(index) {
                if (this.userRole !== 'admin') return;
                if (index > 0) {
                    const start = (this.curruntPage - 1) * this.itemsPerPage;
                    const globalIndex = start + index;
                    const pageImages = this.paginatedImages.slice();
                    [pageImages[index], pageImages[index - 1]] = [pageImages[index - 1], pageImages[index]];
                    this.images.splice(start, this.itemsPerPage, ...pageImages);
                    await this.saveImageOrder();
                }
            },
            async moveImageRight(index) {
                if (this.userRole !== 'admin') return;
                if (index < this.paginatedImages.length - 1) {
                    const start = (this.curruntPage - 1) * this.itemsPerPage;
                    const globalIndex = start + index;
                    const pageImages = this.paginatedImages.slice();
                    [pageImages[index], pageImages[index + 1]] = [pageImages[index + 1], pageImages[index]];
                    this.images.splice(start, this.itemsPerPage, ...pageImages);
                    await this.saveImageOrder();
                }
            },
            async saveImageOrder() {
                this.isLoading = true;
                const token = localStorage.getItem('token');
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };
                try {
                    const response = await fetch('https://artwork-core-for-render-build.onrender.com/SFW/order', {
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify({ images: this.images })
                    });
                    if (!response.ok) {
                        const err = await response.json();
                        throw new Error(err.message || 'Failed to save image order');
                    }
                } catch (error) {
                    console.error('Error saving image order:', error);
                }
                finally {
                    this.isLoading = false;
                }
            },
        }
    }
</script>

<style scoped>
    .button-f2{
        cursor: pointer;
        background-color: #272727;
        color: #fff;
        height: 30px;
        border-radius: 3px;
    }
</style>