class WorkPlace {

    canvas = null;
    ctx = null;

    images = {
        photo: {
            file: '../img/photo/photo.jpg',
            data: null
        },
        grayscale: {
            file: '../img/photo/grayscale.jpg',
            data: null
        },
        mask_1: {
            file: '../img/photo/mask_1.png',
            data: null
        }

    }

    constructor(_canvas_id) {
        this.canvas = document.getElementById(_canvas_id);
        this.ctx = this.canvas.getContext('2d');

        $.each(this.images, (function (el, data) {
            let img = new Image()

            // img.onload = (function (e) {
            //     console.log(e);
            //     this.ctx.drawImage(e.target, 0, 0);
            // }).bind(this);
            $(img).bind('load',
                {
                    context: this.ctx,
                    size: {
                        w: this.canvas.width,
                        h: this.canvas.height
                    },
                    imageData: data
                }, function (e) {
                    e.data.context.drawImage(e.target, 0, 0);
                    e.data.imageData.data = e.data.context.getImageData(0, 0, e.data.size.w, e.data.size.h);
                    e.data.context.clearRect(0, 0, e.data.size.w, e.data.size.h);
                });

            img.src = data.file;

        }).bind(this));

        // this.canvas.onclick = function(){
        //     console.log('click', this);
        //     this.render();
        // }
        this.render();

    }

    render(t) {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if(this.images.photo.data) this.ctx.putImageData(this.images.photo.data, 0, 0);
        this.ctx.globalCompositeOperation = 'color';
        //if(this.images.grayscale.data) this.ctx.putImageData(this.images.grayscale.data, 0, 0);
        if(this.images.mask_1.data) this.ctx.putImageData(this.images.mask_1.data, 0, 0);
        requestAnimationFrame(this.render.bind(this));
    }
}