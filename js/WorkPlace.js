class WorkPlace {

    canvas = null;
    ctx = null;

    images = {
        photo: {
            file: '../img/photo/photo.jpg',
            image: null,
            data: null
        },
        grayscale: {
            file: '../img/photo/photo.jpg',
            image: null,
            data: null
        },
        mask_1: {
            file: '../img/photo/mask_1.png',
            image: null,
            data: null
        }

    }

    constructor(_canvas_id) {
        this.canvas = document.getElementById(_canvas_id);
        this.ctx = this.canvas.getContext('2D');

        $.each(this.images, function (el, data) {
            console.log(el, data);

            let img = new Image()
            img.addEventListener('load', { data: this }, function (e) {
                console.log(this.ctx);

            });
            img.src = data.file;

        })
    }
}