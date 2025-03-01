<template>
    <div class="m-t-20">
      <Loader v-if="isLoading" />
      <div v-else>
        <div class="flex justify-center">
          <button v-if="userRole === 'admin'" @click="showPopup = true" class="button-f">Insert</button>
        </div>
        <div v-if="showPopup" class="po-fixed po-fixed-mod bg-c-popup flex justify-center items-center">
          <div class="bg-c-white c-black p-1 border-radius-5 h-500 w-800">
            <h1>{{ editMode ? 'Update video' : 'Insert video' }}</h1>
            <form @submit.prevent="saveVideo" class="flex flex-column gap">
              <label for="video-type" class="f-20 bold">- Not Safe For Work Video -</label>
              <input v-model="videoType" id="video-type" disabled hidden>
              <label for="video-url">URL's video: </label>
              <input v-model="nsfwVideoUrl" id="video-url" type="text" placeholder="Type video's URL here">
              <label for="video-name">Video name: </label>
              <input v-model="nsfwVideoName" id="video-name" type="text" placeholder="Type video's name here">
              <label for="video-des">Video describe: </label>
              <input v-model="nsfwVideoDescribe" id="video-des" type="text" placeholder="Type video's describe here">
              <div class="flex flex-column gap-10 items-end">
                <button type="submit" class="button-f">{{ editMode ? 'Update' : 'Insert' }}</button>
                <button type="button" class="button-f" @click="closePopup">Cancel</button>
              </div>
            </form>
          </div>
        </div>
  
        <div class="flex m-t-20 over-hidden gap-18 flex-wrap justify-center-2">
          <div v-for="(video, index) in paginatedVideos" :key="video.id" class="m-t-20 gap-5 img-slice">
            <div class="flex gap-10 m-b">
              <button v-if="userRole === 'admin'" @click="updateVideo(index)" class="button-f">Update</button>
              <button v-if="userRole === 'admin'" @click="deleteVideo(video.id)" class="button-f">Delete</button>
              <button v-if="userRole === 'admin'" @click="moveImageLeft(index)" class="button-f2">
                  <span>&#8592;</span>
              </button>
              <button v-if="userRole === 'admin'" @click="moveImageRight(index)" class="button-f2">
                  <span>&#8594;</span>
              </button>
            </div>
            <video :src="video.nsfwVideoUrl" controls class="img"></video>
            <p>{{ video.nsfwVideoName }}</p>
            <p>{{ video.describe }}</p>
          </div>
        </div>
  
        <PageChanger
          v-if="videos.length > 0"
          :totalPages="totalPages"
          :curruntPage="curruntPage"
          @page-change="changePage"
        />
      </div>
    </div>
  </template>
  
  <script>
  import PageChanger from "../admin-page/other-admin-fuction/PageChanger.vue";
  import Loader from "../other-functions/Loader.vue";
  
  export default {
    components: { PageChanger, Loader },
    data() {
      return {
        showPopup: false,
        editMode: false,
        videoType: 'nsfwvideo',
        nsfwVideoUrl: '',
        nsfwVideoName: '',
        nsfwVideoDescribe: '',
        editIndex: null,
        videos: [],
        userRole: '',
        curruntPage: 1,
        itemsPerPage: 6,
        curruntVideo: null,
        isLoading: false,
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.videos.length / this.itemsPerPage);
      },
      paginatedVideos() {
        const start = (this.curruntPage - 1) * this.itemsPerPage;
        return this.videos.slice(start, start + this.itemsPerPage);
      }
    },
    created() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push({ path: "/" });
      } else {
        this.fetchVideos();
        this.checkUserRole();
      }
    },
    methods: {
      changePage(page) {
        this.curruntPage = page;
      },
      checkUserRole() {
        const role = localStorage.getItem('role');
        if (role) {
          this.userRole = role;
          return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
          this.userRole = 'guest';
          return;
        }
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.error('Token format is incorrect');
          this.userRole = 'guest';
          return;
        }
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          this.userRole = decodedToken.role;
        } catch (error) {
          console.error('Error decoding token: ', error);
          this.userRole = 'guest';
        }
      },
      closePopup() {
        this.showPopup = false;
        this.nsfwVideoUrl = '';
        this.nsfwVideoName = '';
        this.nsfwVideoDescribe = '';
        this.videoType = 'nsfwvideo';
        this.editMode = false;
        this.editIndex = null;
      },
      async fetchVideos() {
        this.isLoading = true;
        try {
          const response = await fetch('https://artwork-core-for-render-build.onrender.com/NSFWVideo', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
          });
          if (!response.ok) {
            if (response.status === 400) {
              alert('You must be at least 18 years old to access this content!');
              this.$router.push({ path: "/" });
            } else if (response.status === 401) {
              alert('You need to sign in to gain access to here!');
              this.$router.push({ path: "/" });
            }
            throw new Error('Failed to fetch videos');
          }
          const data = await response.json();
          this.videos = [...data.list_data_nsfwvideo];
        } catch (error) {
          console.error('Can not get any videos, error:', error);
        } finally {
          this.isLoading = false;
        }
      },
      async saveVideo() {
        this.isLoading = true;
        const videoData = {
          nsfwVideoUrl: this.nsfwVideoUrl,
          nsfwVideoName: this.nsfwVideoName,
          describe: this.nsfwVideoDescribe
        };
        const type = this.videoType;
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        try {
          if (this.editMode) {
            const globalIndex = this.editIndex;
            const response = await fetch(`https://artwork-core-for-render-build.onrender.com/NSFWVideo/put/${this.videos[globalIndex].id}`, {
              method: 'PUT',
              headers: headers,
              body: JSON.stringify({ Type: type, Data: videoData })
            });
            if (!response.ok) {
              const err = await response.json();
              throw new Error(err.message);
            }
            await response.json();
            this.videos[globalIndex] = { ...this.videos[globalIndex], ...videoData };
            this.closePopup();
          } else {
            const response = await fetch('https://artwork-core-for-render-build.onrender.com/NSFWVideo/post', {
              method: 'POST',
              headers: headers,
              body: JSON.stringify({ Type: type, Data: videoData })
            });
            if (!response.ok) {
              const err = await response.json();
              throw new Error(err.message);
            }
            const newVideo = await response.json();
            const newVideoWithOrder = {
              id: newVideo.id,
              ...videoData,
              order: 0 // Gán order = 0 cho video mới
            };
            this.videos.unshift(newVideoWithOrder); // Thêm vào đầu mảng
            for (let i = 1; i < this.videos.length; i++) {
              this.videos[i].order = i; // Cập nhật order cho các video còn lại
            }
            await this.saveVideoOrder(); // Lưu thứ tự mới về server
            this.curruntPage = 1; // Chuyển về trang 1 để hiển thị video mới
            this.closePopup();
          }
        } catch (error) {
          console.error(`Error while ${this.editMode ? 'updating' : 'inserting'} video: `, error);
        } finally {
          this.isLoading = false;
        }
      },
      updateVideo(index) {
        this.editMode = true;
        this.showPopup = true;
        const start = (this.curruntPage - 1) * this.itemsPerPage;
        this.editIndex = start + index;
        this.videoType = this.videos[this.editIndex].videoType || 'nsfwvideo';
        this.nsfwVideoUrl = this.videos[this.editIndex].nsfwVideoUrl;
        this.nsfwVideoName = this.videos[this.editIndex].nsfwVideoName;
        this.nsfwVideoDescribe = this.videos[this.editIndex].describe;
      },
      deleteVideo(id) {
        this.isLoading = true;
        const type = this.videos.find(video => video.id === id).videoType || 'nsfwvideo';
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        fetch('https://artwork-core-for-render-build.onrender.com/NSFWVideo/del/', {
          method: 'DELETE',
          headers: headers,
          body: JSON.stringify({ Type: type, Data: { id } })
        })
        .then(() => {
          this.videos = this.videos.filter(video => video.id !== id);
        })
        .catch(error => {
          console.error('Error while deleting video: ', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
      },
      async moveVideoLeft(index) {
        if (this.userRole !== 'admin') return;
        if (index > 0) {
          const start = (this.curruntPage - 1) * this.itemsPerPage;
          const pageVideos = this.paginatedVideos.slice();
          [pageVideos[index], pageVideos[index - 1]] = [pageVideos[index - 1], pageVideos[index]];
          this.videos.splice(start, this.itemsPerPage, ...pageVideos);
          await this.saveVideoOrder();
        }
      },
      async moveVideoRight(index) {
        if (this.userRole !== 'admin') return;
        if (index < this.paginatedVideos.length - 1) {
          const start = (this.curruntPage - 1) * this.itemsPerPage;
          const pageVideos = this.paginatedVideos.slice();
          [pageVideos[index], pageVideos[index + 1]] = [pageVideos[index + 1], pageVideos[index]];
          this.videos.splice(start, this.itemsPerPage, ...pageVideos);
          await this.saveVideoOrder();
        }
      },
      async saveVideoOrder() {
        this.isLoading = true;
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        try {
          const response = await fetch('https://artwork-core-for-render-build.onrender.com/NSFWVideo/order', {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ NsfwVideos: this.videos }) // Gửi danh sách video với key "NsfwVideos"
          });
          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to save video order');
          }
        } catch (error) {
          console.error('Error saving video order:', error);
        } finally {
          this.isLoading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .button-f2 {
    cursor: pointer;
    background-color: #272727;
    color: #fff;
    height: 30px;
    border-radius: 3px;
  }
  </style>