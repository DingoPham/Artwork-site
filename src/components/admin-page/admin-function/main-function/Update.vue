<script>
    export default{
        methods:{
            updateImages(image){
                fetch('/ArtworkCombineController/put',{
                    method: 'PUT',
                    headers: {
                        'Context-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Type: 'sfw_art',
                        Data: image
                    })
                })
                .then(response => response.json())
                .then(data => {
                    //xử lý sau khi cập nhật thành công
                    const index = this.images.findIndex(img => img.id === image.id);
                    this.images.splice(index, 1, data);
                })
                .catch(error => {
                    console.error("Update image error:", error);
                });
            }
        }
    };
</script>