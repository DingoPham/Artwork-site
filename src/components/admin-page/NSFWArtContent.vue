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
            <label for="img-type" class="f-20 bold">- Not Safe For Work Art -</label>
            <input v-model="imgType" id="img-type" disabled hidden>
            <label for="img-url">URL's image: </label>
            <input v-model="imgNsfwUrl" id="img-url" type="text" placeholder="Type image's URL here">
            <label for="img-name">Image name: </label>
            <input v-model="imgNsfwName" id="img-name" type="text" placeholder="Type image's name here">
            <label for="img-des">Image describe: </label>
            <input v-model="imgNsfwDescribe" id="img-des" type="text" placeholder="Type image's describe here">
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
            <button v-if="userRole === 'admin'" @click="moveImageLeft(index)" class="button-f2">←</button>
            <button v-if="userRole === 'admin'" @click="moveImageRight(index)" class="button-f2">→</button>
          </div>
          <img :src="image.imgNsfwUrl" alt="" @click="showFullImage(image)" class="img" />
          <p>{{ image.imgNsfwName }}</p>
          <p>{{ image.describe }}</p>
        </div>
      </div>

      <div v-if="showImagePopup" class="po-fixed po-fixed-mod bg-c-popup flex justify-center items-center">
        <div class="div">
          <img :src="curruntImage.imgNsfwUrl" alt="">
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
import PageChanger from "../admin-page/other-admin-fuction/PageChanger.vue";
import Loader from "../other-functions/Loader.vue";

export default {
  components: { PageChanger, Loader },
  data() {
    return {
      showPopup: false,
      editMode: false,
      imgType: 'nsfw_art',
      imgNsfwUrl: '',
      imgNsfwName: '',
      imgNsfwDescribe: '',
      editIndex: null,
      images: [],
      userRole: '',
      curruntPage: 1,
      itemsPerPage: 6,
      showImagePopup: false,
      curruntImage: null,
      isLoading: false,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.images.length / this.itemsPerPage);
    },
    paginatedImages() {
      const start = (this.curruntPage - 1) * this.itemsPerPage;
      return this.images.slice(start, start + this.itemsPerPage);
    }
  },
  created() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push({ path: "/" });
    } else {
      this.fetchImages();
      this.checkUserRole();
    }
  },
  methods: {
    showFullImage(image) {
      this.curruntImage = image;
      this.showImagePopup = true;
    },
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
      this.imgNsfwUrl = '';
      this.imgNsfwName = '';
      this.imgNsfwDescribe = '';
      this.imgType = 'nsfw_art';
      this.editMode = false;
      this.editIndex = null;
    },
    async fetchImages() {
      this.isLoading = true;
      try {
        const response = await fetch('https://artwork-core-for-render-build.onrender.com/NSFW', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          if (response.status === 400) {
            alert('You must be at least 18 years old to access this content!');
            this.$router.push({ path: "/" });
          } else if (response.status === 401) {
            alert('You need to sign in to gain access to here!');
            this.$router.push({ path: "/" });
          }
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        this.images = [...data.list_data_nsfwart];
      } catch (error) {
        console.error('Can not get any images, error:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async saveImage() {
      this.isLoading = true;
      const imgData = {
        imgNsfwUrl: this.imgNsfwUrl,
        imgNsfwName: this.imgNsfwName,
        describe: this.imgNsfwDescribe
      };
      const type = this.imgType;
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      try {
        if (this.editMode) {
          const globalIndex = this.editIndex;
          const response = await fetch(`https://artwork-core-for-render-build.onrender.com/NSFW/put/${this.images[globalIndex].id}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ Type: type, Data: imgData })
          });
          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message);
          }
          await response.json();
          this.images[globalIndex] = { ...this.images[globalIndex], ...imgData };
          this.closePopup();
        } else {
          const response = await fetch('https://artwork-core-for-render-build.onrender.com/NSFW/post', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ Type: type, Data: imgData })
          });
          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message);
          }
          const newImage = await response.json();
          const newImageWithOrder = {
            id: newImage.id,
            ...imgData,
            order: 0 // Gán order = 0 cho ảnh mới
          };
          this.images.unshift(newImageWithOrder); // Thêm vào đầu mảng
          // Cập nhật order cho các ảnh còn lại
          for (let i = 1; i < this.images.length; i++) {
            this.images[i].order = i;
          }
          await this.saveImageOrder(); // Lưu thứ tự mới về server
          this.curruntPage = 1; // Chuyển về trang 1 để hiển thị ảnh mới
          this.closePopup();
        }
      } catch (error) {
        console.error(`Error while ${this.editMode ? 'updating' : 'inserting'} image: `, error);
      } finally {
        this.isLoading = false;
      }
    },
    updateImage(index) {
      this.editMode = true;
      this.showPopup = true;
      const start = (this.curruntPage - 1) * this.itemsPerPage;
      this.editIndex = start + index;
      this.imgType = this.images[this.editIndex].imgType || 'nsfw_art';
      this.imgNsfwUrl = this.images[this.editIndex].imgNsfwUrl;
      this.imgNsfwName = this.images[this.editIndex].imgNsfwName;
      this.imgNsfwDescribe = this.images[this.editIndex].describe;
    },
    deleteImage(id) {
      this.isLoading = true;
      const type = this.images.find(image => image.id === id).imgType || 'nsfw_art';
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      fetch('https://artwork-core-for-render-build.onrender.com/NSFW/del/', {
        method: 'DELETE',
        headers: headers,
        body: JSON.stringify({ Type: type, Data: { id } })
      })
      .then(() => {
        this.images = this.images.filter(image => image.id !== id);
      })
      .catch(error => {
        console.error('Error while deleting image: ', error);
      })
      .finally(() => {
        this.isLoading = false;
      });
    },
    async moveImageLeft(index) {
      if (this.userRole !== 'admin') return;
      if (index > 0) {
        const start = (this.curruntPage - 1) * this.itemsPerPage;
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
        const response = await fetch('https://artwork-core-for-render-build.onrender.com/NSFW/order', {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify({ NsfwImages: this.images }) // Điều chỉnh key theo backend
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || 'Failed to save image order');
        }
      } catch (error) {
        console.error('Error saving image order:', error);
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