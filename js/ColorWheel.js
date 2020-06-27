class ColorWheel {

    canvas = null;
    ctx = null;

    x0 = null;
    y0 = null;
    width = null;
    height = null;
    inner_arc_radius = null;
    outer_arc_radius = null;
    angle = (Math.PI * 2) / 12;

    colors = null;

    currentMode = 'mono';

    primaryColor = {
        value: 0,
        paletteIndex: 0,
        wheelAngle: 0
    }
    palette = [this.primaryColor.value];

    hotIndexes = [0];

    shiftCoeff = 1.15;

    constructor(_canvas_id, _mode, _colors) {
        this.classContext = this;
        this.canvas = document.getElementById(_canvas_id);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.x0 = this.width / 2;
        this.y0 = this.height / 2;
        this.inner_arc_radius = this.x0 * 0.5;
        this.outer_arc_radius = this.x0 * 0.85;
        this.currentMode = _mode;
        if (_colors.length != 12) {
            alert("Должно быть 12 цветов")
        } else {
            this.colors = _colors;
        }
        this.primaryColor.value = this.colors[0];
        $(this.canvas).on('click', { obj: this }, this.canvasClick);
        this.updatePalette(this.colors[0]);
        this.renderWheel();
        $.event.trigger('palette-changed', [this.palette]);
    }

    renderWheel() {
        this.ctx.resetTransform();
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.strokeStyle = "gray";
        this.ctx.lineWidth = .3;

        let dr = (Math.PI * 2) / 24;

        this.ctx.translate(this.x0, this.y0);
        for (let i = 0; i < 12; i++) {
            this.ctx.fillStyle = this.colors[i];
            this.ctx.beginPath()
            if (this.hotIndexes.includes(i)) {
                this.ctx.arc(0, 0, this.outer_arc_radius * this.shiftCoeff, -dr, this.angle - dr, false);
                this.ctx.arc(0, 0, this.inner_arc_radius * this.shiftCoeff, this.angle - dr, -dr, true);
                this.ctx.lineTo(Math.cos(-dr) * this.outer_arc_radius * this.shiftCoeff, Math.sin(-dr) * this.outer_arc_radius * this.shiftCoeff);
            } else {
                this.ctx.arc(0, 0, this.outer_arc_radius, -dr, this.angle - dr, false);
                this.ctx.arc(0, 0, this.inner_arc_radius, this.angle - dr, -dr, true);
                this.ctx.lineTo(Math.cos(-dr) * this.outer_arc_radius, Math.sin(-dr) * this.outer_arc_radius);
            }
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.rotate(this.angle);

        }
        this.drawRelations();
    }

    // Обновить палитру с учетом текущего режима
    updatePalette(_color) {
        //if(_color == this.primaryColor.value) return;

        for (let i = 0; i < this.colors.length; i++) {
            if (this.colors[i].toUpperCase() == _color.toUpperCase()) {
                this.primaryColor.value = _color
                this.primaryColor.paletteIndex = i;
                this.primaryColor.wheelAngle = i * this.angle;
                break;
            }
        }
        this.hotIndexes = [];
        let n = this.primaryColor.paletteIndex;
        switch (this.currentMode) {
            case 'mono': {
                this.hotIndexes.push(n);
            } break;
            case 'kompl': {
                this.hotIndexes.push(n);
                this.hotIndexes.push((n + 6) % 12);
            } break;
            case 'triada': {
                this.hotIndexes.push(n);
                this.hotIndexes.push((n + 4) % 12);
                this.hotIndexes.push((n + 8) % 12);
            } break;
            case 'razd-kompl': {
                this.hotIndexes.push(n);
                this.hotIndexes.push((n + 5) % 12);
                this.hotIndexes.push((n + 7) % 12);
            } break;
            case 'tetrada': {
                this.hotIndexes.push(n);
                this.hotIndexes.push((n + 2) % 12);
                this.hotIndexes.push((n + 6) % 12);
                this.hotIndexes.push((n + 8) % 12);
            } break;
            case 'analog': {
                this.hotIndexes.push(n);
                this.hotIndexes.push((n + 1) % 12);
                this.hotIndexes.push((n + 11) % 12);
            } break;
            case 'analog-kompl': {
                this.hotIndexes.push(n);
                this.hotIndexes.push((n + 1) % 12);
                this.hotIndexes.push((n + 6) % 12);
                this.hotIndexes.push((n + 11) % 12);
            } break;
        }

        this.palette = [];
        for (let i = 0; i < this.hotIndexes.length; i++) {
            this.palette.push(this.colors[this.hotIndexes[i]]);
        }
        this.renderWheel();
    }

    RGBToHex(r, g, b) {
        r = r.toString(16);
        g = g.toString(16);
        b = b.toString(16);

        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;

        return "#" + r + g + b;
    }

    getColor(_x, _y) {
        let p = this.ctx.getImageData(_x, _y, 1, 1).data;
        return this.RGBToHex(p[0], p[1], p[2]).toUpperCase();
    }

    setMode(_mode) {
        this.currentMode = _mode;
        this.updatePalette(this.primaryColor.value);
        this.renderWheel();
        $.event.trigger('palette-changed', [this.palette]);
    }

    drawRelations() {
        this.ctx.resetTransform();
        let l = this.inner_arc_radius * this.shiftCoeff;
        let r = 6;
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "gray";
        this.ctx.fillStyle = "white";

        switch (this.currentMode) {
            case 'mono': {
                this.ctx.translate(this.x0, this.y0);
                this.ctx.rotate(this.primaryColor.wheelAngle);

                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(l, 0);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(0, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(l, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            } break;
            case 'kompl': {
                this.ctx.translate(this.x0, this.y0);
                this.ctx.rotate(this.primaryColor.wheelAngle);

                this.ctx.beginPath();
                this.ctx.moveTo(-l, 0);
                this.ctx.lineTo(l, 0);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(-l, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(l, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            } break;
            case 'triada': {
                this.ctx.translate(this.x0, this.y0);
                this.ctx.rotate(this.primaryColor.wheelAngle);

                for (let i = 0; i < 3; i++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, 0);
                    this.ctx.lineTo(l, 0);
                    this.ctx.stroke();

                    this.ctx.beginPath();
                    this.ctx.arc(l, 0, r, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.stroke();

                    this.ctx.rotate(Math.PI * 2 / 3);
                }

                this.ctx.beginPath();
                this.ctx.arc(0, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            } break;
            case 'razd-kompl': {
                this.ctx.translate(this.x0, this.y0);
                this.ctx.rotate(this.primaryColor.wheelAngle);


                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(l, 0);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(l, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.rotate((Math.PI * 2 / 3) + (Math.PI * 2 / 12));

                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(l, 0);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(l, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.rotate(Math.PI * 2 / 6);

                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(l, 0);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(l, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(0, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            } break;
            case 'tetrada': {
                this.ctx.translate(this.x0, this.y0);
                this.ctx.rotate(this.primaryColor.wheelAngle);

                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(l, 0);
                this.ctx.stroke();

                this.ctx.beginPath()
                this.ctx.arc(l, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.rotate(Math.PI * 2 / 6);

                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(l, 0);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(l, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.rotate(Math.PI * 2 / 3);

                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(l, 0);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(l, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.rotate(Math.PI * 2 / 6);

                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(l, 0);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(l, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(0, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            } break;
            case 'analog': {
                this.ctx.translate(this.x0, this.y0);
                this.ctx.rotate(this.primaryColor.wheelAngle);


                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(l, 0);
                this.ctx.stroke();

                this.ctx.beginPath()
                this.ctx.arc(l, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.rotate(Math.PI * 2 / 12);

                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(l, 0);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(l, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.rotate(-Math.PI * 2 / 6);

                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(l, 0);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(l, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(0, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            } break;
            case 'analog-kompl': {
                this.ctx.translate(this.x0, this.y0);
                this.ctx.rotate(this.primaryColor.wheelAngle);


                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(l, 0);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(l, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.rotate(Math.PI * 2 / 12);

                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(l, 0);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(l, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.rotate(-Math.PI * 2 / 6);

                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(l, 0);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(l, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.rotate((Math.PI * 2 / 12) * 7);

                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(l, 0);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(l, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(0, 0, r, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            } break;
        }

    }
    canvasClick(e) {
        console.log('something');

        let color = e.data.obj.getColor(e.originalEvent.offsetX, e.originalEvent.offsetY);
        e.data.obj.updatePalette(color);
        $.event.trigger('palette-changed', [e.data.obj.palette]);
    }
}