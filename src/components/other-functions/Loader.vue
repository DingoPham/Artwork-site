<template>
    <div class="loader">
      <div v-if="showSpinner" class="spinner"></div>
      <span>{{ message }}</span>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Loader',
    props: {
      message: {
        type: String,
        default: 'Loading content, please wait...'
      },
      showSpinner: {
        type: Boolean,
        default: true
      }
    }
  };
  </script>
  
  <style scoped>
  .loader {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-size: 18px;
    color: #555;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 10px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>