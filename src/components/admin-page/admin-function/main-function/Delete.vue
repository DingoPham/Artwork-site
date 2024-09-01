<script>
    export default{
        methods:{
            deleteImage(imageId){
                fetch('/ArtworkCombineController/del', {
                    method: 'DELETE',
                    headers: {
                        'Context-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Type: 'sfw_art',
                        Data: {id: imageId}
                    })
                })
                .then(() => {
                    //Xử lý khi xoá ảnh thành công
                    this.images = this.images.filter(img => img.id !== imageId);
                })
                .catch(error => {
                    console.error("Delete image error: ", error);
                });
            }
        }
    };
</script>