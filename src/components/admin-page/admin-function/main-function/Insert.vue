<script>
    export default{
        data(){
            return{
                newImages:{
                    id: '',
                    url: '',
                    name: '',
                    descibe: '',
                }
            };
        },
        methods: {
            addImage(){
                fetch('/ArtworkCombineController/post', {
                    method: 'POST',
                    headers:{
                        'Context-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Type: 'sfw_art',
                        Data: this.newImages
                    })
                })
                .then(response => response.json())
                .then(data => {
                    // xử lý sau khi thêm thành công
                    this.images.push(data);
                    this.newImages = {id: '', imgUrl: '', imgName: '', imgDescibe: ''};
                })
                .catch(error => {
                    console.error('Insert image error:', error);
                });
            }
        }
    };
</script>