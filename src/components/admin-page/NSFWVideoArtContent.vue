<template>
    <div class="m-t-20">
        <div class="flex justify-center">
            <button v-if="userRole === 'admin'" @click="showPopup = true" class="button-f">Insert</button>
        </div>
        <div v-if="showPopup" class="po-fixed po-fixed-mod bg-c-popup flex justify-center items-center">
            <div class="bg-c-white p-1 border-radius-5 h-500 w-800">
                <h1>{{ editMode ? 'Update video' : 'Insert video' }}</h1>

                <form @submit.prevent="saveVideo" class="flex flex-column gap">
                    <label for="video-type" class="f-20 bold">- Not safe for work video -</label>
                    <input v-model="videoType" id="video-type" disabled hidden></input>
                    
                    <label for="video-url">URL's video: </label>
                    <input v-model="videoUrl" id="video-url" type="text" placeholder="Type video's URL here">

                    <label for="video-name">Video name: </label>
                    <input v-model="videoName" id="video-name" type="text" placeholder="Type video's name here">

                    <label for="video-des">Video describe: </label>
                    <input v-model="videoDescribe" id="video-des" type="text" placeholder="Type video's describe here">

                    <div class="flex flex-column gap-10 items-end  ">
                        <button type="submit" class="button-f">{{ editMode ? 'Update' : 'Insert' }}</button>
                        <button type="button" class="button-f" @click="closePopup">Cancle</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="flex m-t-20 over-hidden gap-18 flex-wrap">
            <div v-for="(video, index) in paginatedVideos" :key="video.id" class="m-t-20 gap-5 img-slice"> 
                <div class="flex gap-10 m-b">
                    <button v-if="userRole === 'admin'" @click="updateVideo(index)" class="button-f">Update</button>
                    <button v-if="userRole === 'admin'" @click="deleteVideo(video.id)" class="button-f">Delete</button>
                </div>
                <video :src="video.videoUrl" controls class="img"></video>
                <p>{{ video.videoName }}</p>
                <p>{{ video.describe }}</p>
            </div>
        </div>
        
        <PageChanger
            v-if="videos.length > 0"
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
                videoType: 'nsfw-video', // type
                videoUrl: '',
                videoName: '',
                videoDescribe: '',
                editIndex: null,
                videos: [],
                userRole: '', // track role
                curruntPage: 1,
                itemsPerPage: 6,
                curruntVideo: null,
            };
        },
        computed:{
            totalPages(){
                return Math.ceil(this.videos.length / this.itemsPerPage);
            },
            paginatedVideos(){
                const start = (this.curruntPage - 1) * this.itemsPerPage;
                return this.videos.slice(start, start + this.itemsPerPage);
            }
        },
        created(){
            const token = localStorage.getItem('token');
            if(!token){
                this.$router.push({path: "/"})
            }
            else{
                this.fetchVideos();
                this.checkUserRole();
            }
        },
        methods:{
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
                this.videoUrl = '';
                this.videoName = '';
                this.videoDescribe = '';
                this.videoType = 'nsfw-video'; // close popup with this type
                this.editMode = false;
                this.editIndex = null;
            },
            fetchVideos(){
                const baseUrl = process.env.VUE_APP_API_BASE_URL;
                fetch(`${baseUrl}/NSFWVideo`, {
                    headers: {
                        'Authorization' : `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type' : 'application/json'
                    },
                })
                .then(response => {
                    if(!response.ok){
                        if(response.status === 400){
                            alert('You must be at least 18 years old to access this content!');
                            this.$router.push({ path: "/" });
                        }
                        else if(response.status === 401){
                            alert('You need to sign in to gain access to here!');
                            this.$router.push({ path: "/" });
                        }
                        throw new Error('Failed to fetch videos');
                    }
                    return response.json();
                })
                .then(data => {
                    this.videos = [...data.list_data_nsfwvideo]
                })
                .catch(error => {
                console.error('Can not get any videos, error:', error);
                });
            },
            saveVideo(){
                const videoData = {
                    videoUrl: this.videoUrl,
                    videoName: this.videoName,
                    describe: this.videoDescribe
                };

                console.log("Data test:", videoData);

                const type = this.videoType; // selected type
                const token = localStorage.getItem('token'); // get token from local storage
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // add token to header
                };

                if (this.editMode){
                    const baseUrl = process.env.VUE_APP_API_BASE_URL;
                    fetch(`${baseUrl}/put/${this.videos[this.editIndex].id}`,{ 
                        method: 'PUT',
                        headers: headers,
                        body: JSON.stringify({Type: type, Data: videoData})
                    })
                    .then(response => response.json())
                    .then(() => {
                        this.videos[this.editIndex] = { ...videoData};
                        this.closePopup();
                    })
                    .catch(error => {
                        console.error('Error while updating video: ', error);
                    });
                }
                else{
                    const baseUrl = process.env.VUE_APP_API_BASE_URL;
                    fetch(`${baseUrl}/NSFWVideo/post`,{
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({Type: type, Data: videoData})
                    })
                    .then(response => {
                        if(!response.ok){
                            return response.json().then(err => {
                                throw new Error(err.message);
                            });
                        }
                        return response.json();
                    })
                    .then(newVideo => {
                        this.videos.push({
                            id: newVideo.id,
                            ...videoData
                        });
                        this.closePopup();
                    })
                    .catch(error =>{
                        console.error('Error while inserting video: ', error)
                    });
                }
            },
            updateVideo(index){
                this.editMode = true;
                this.showPopup = true;
                this.editIndex = index;
                this.videoType = this.videos[index].videoType || 'nsfw-video'; //add type for pre-fill
                this.videoUrl = this.videos[index].videoUrl;
                this.videoName = this.videos[index].videoName;
                this.videoDescribe = this.videos[index].describe;
            },
            deleteVideo(id){
                const type = this.videos.find(video => video.id === id).videoType || 'nsfw-video';
                const token = localStorage.getItem('token');

                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // add token to header
                };

                const baseUrl = process.env.VUE_APP_API_BASE_URL;
                fetch(`${baseUrl}/NSFWVideo/del/`, {
                    method: 'DELETE',
                    headers: headers,
                    body: JSON.stringify({ Type: type, Data: {id} })
                })
                .then(() =>{
                    this.videos = this.videos.filter(video => video.id !== id);
                })
                .catch(error => {
                    console.error('Error while deleting video: ', error);
                });
            },
        }
    }
</script>