var _wheel = null;
let thingsPalette = [null, null, null, null];
let currentThing = 1;
let currentModel = 1;

$(document).ready(function () {

    wheel = new ColorWheel("canvas-wheel", "triada", colors);

    $(document).on("palette-changed", function () {
        updateThingsPaletteFromWheel();
        colorizeSliders();
        finalRender();
    });

    function updateThingsPaletteFromWheel() {
        switch (wheel.palette.length) {
            case 1:
                thingsPalette[0] = wheel.palette[0];
                thingsPalette[1] = wheel.palette[0];
                thingsPalette[2] = wheel.palette[0];
                thingsPalette[3] = wheel.palette[0];
                break;
            case 2:
                thingsPalette[0] = wheel.palette[0];
                thingsPalette[1] = wheel.palette[1];
                thingsPalette[2] = wheel.palette[1];
                thingsPalette[3] = wheel.palette[0];
                break;

            case 3:
                thingsPalette[0] = wheel.palette[0];
                thingsPalette[1] = wheel.palette[1];
                thingsPalette[2] = wheel.palette[2];
                thingsPalette[3] = wheel.palette[2];
                break;
            case 4:
                thingsPalette[0] = wheel.palette[0];
                thingsPalette[1] = wheel.palette[2];
                thingsPalette[2] = wheel.palette[1];
                thingsPalette[3] = wheel.palette[3];
                break;
            default:
                break;
        }
    }

    function colorizeSliders() {
        // colorize sliders with color of the currrent thing from the current things palette
        let color = thingsPalette[currentThing - 1];
        let hsl = hexStringToHSLData(color);
        $('#hue-slider').slider({ value: hsl[0] });
        $('#saturation-slider').slider({ value: hsl[1] });
        $('#saturation-slider.ui-slider-horizontal').css('background', 'linear-gradient(to right, #808080 0%, ' + color + ' 100%)');
        $('#lightness-slider').slider({ value: hsl[2] });
        $('#lightness-slider.ui-slider-horizontal').css('background', 'linear-gradient(to right, #000000 0%, ' + color + ' 50%, #ffffff 100%)');
    }

    // Слайдер оттенка
    $("#hue-slider").slider({
        min: 0,
        max: 360,
        value: 180,
        slide: sliderChanged
    });
    //Слайдер насыщенности
    $("#saturation-slider").slider({
        min: 0,
        max: 100,
        value: 100,
        slide: sliderChanged
    });
    //Слайдер светлоты
    $("#lightness-slider").slider({
        min: 0,
        max: 100,
        value: 50,
        slide: sliderChanged
    });
    function sliderChanged(e, o) {
        let h = $('#hue-slider').slider('value');
        let s = $('#saturation-slider').slider('value');
        let l = $('#lightness-slider').slider('value');
        let hsl = 'hsl(' + o.value + ', ' + s + '%, ' + l + '%)';

        if (e.target.id == "hue-slider") {
            $('#saturation-slider.ui-slider-horizontal').css('background', 'linear-gradient(to right, #808080 0%, ' + 'hsl(' + h + ', 100%, 50%)' + ' 100%)');
            $('#lightness-slider.ui-slider-horizontal').css('background', 'linear-gradient(to right, #000000 0%, ' + 'hsl(' + h + ', 100%, 50%)' + ' 50%, #ffffff 100%)');
        }

        thingsPalette[currentThing - 1] = hslToHexString(h, s, l);
        finalRender();
    }

    $("input").checkboxradio();
    $("input").on('change', thingChanged);
    function thingChanged(e) {
        currentThing = e.target.dataset.value;
        //updateThingsPalette();
        colorizeSliders(wheel.palette[e.target.dataset.value - 1]);
    }

    $('.btn-mode-set').on('click', function (e) {
        wheel.setMode(e.currentTarget.dataset.modename);
        finalRender();
    });

    $('#blend-mode').selectmenu({
        change: blendModeChanged
    });

    $('#b-prev-model').click(function (e) {
        currentModel = (currentModel == 1) ? models.length : currentModel - 1;
        setModel(currentModel);
    });

    $('#b-next-model').click(function (e) {
        currentModel = (currentModel == models.length) ? 1 : currentModel + 1;
        setModel(currentModel);
    });

    function blendModeChanged(e, data) {
        console.log("Blend mode changed to '" + data.item.value + "'");
        $('.color').css('mix-blend-mode', data.item.value);
        finalRender();
    }

    function hslToRgb(h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h * 360, s * 100, l * 100];
    }
    function hexRGBStringToHSLString(color) {
        let r = parseInt(color.substr(1, 2), 16);
        let g = parseInt(color.substr(3, 2), 16);
        let b = parseInt(color.substr(5, 2), 16);
        hsl = rgbToHsl(r, g, b);
        return 'hsl(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%)';
    }
    function hexStringToHSLData(color) {
        let r = parseInt(color.substr(1, 2), 16);
        let g = parseInt(color.substr(3, 2), 16);
        let b = parseInt(color.substr(5, 2), 16);
        return rgbToHsl(r, g, b);
    }
    function rgbToHexString(r, g, b) {
        let _r = r.toString(16);
        if (_r.length == 1) _r = "0" + _r;
        let _g = g.toString(16);
        if (_g.length == 1) _g = "0" + _g;
        let _b = b.toString(16);
        if (_b.length == 1) _b = "0" + _b;
        return '#' + _r + _g + _b
    }
    function hslToHexString(h, s, l) {
        let rgb = hslToRgb(h / 360, s / 100, l / 100);
        return rgbToHexString(rgb[0], rgb[1], rgb[2])
    }

    function finalRender() {
        for (let i = 0; i < thingsPalette.length; i++) {
            $('#color-' + String(i + 1)).css('background-color', thingsPalette[i]);
        }
    }

    function setModel(n) {
        $('#photo').attr('src', './img/models/' + String(n) + '/photo.jpg');

        $('#thing-1').attr('src', models[n - 1].grayscale);
        $('#thing-2').attr('src', models[n - 1].grayscale);
        $('#thing-3').attr('src', models[n - 1].grayscale);
        $('#thing-4').attr('src', models[n - 1].grayscale);

        $('#thing-1').css('-webkit-mask-image', 'url("' + models[n - 1].mask_1 + '")');
        $('#thing-2').css('-webkit-mask-image', 'url("' + models[n - 1].mask_2 + '")');
        $('#thing-3').css('-webkit-mask-image', 'url("' + models[n - 1].mask_3 + '")');
        $('#thing-4').css('-webkit-mask-image', 'url("' + models[n - 1].mask_4 + '")');

        $('#color-1').css('-webkit-mask-image', 'url("' + models[n - 1].mask_1 + '")');
        $('#color-2').css('-webkit-mask-image', 'url("' + models[n - 1].mask_2 + '")');
        $('#color-3').css('-webkit-mask-image', 'url("' + models[n - 1].mask_3 + '")');
        $('#color-4').css('-webkit-mask-image', 'url("' + models[n - 1].mask_4 + '")');

        $('#model-label-1').text(models[n - 1].labels[0]);
        $('#model-label-2').text(models[n - 1].labels[1]);
        $('#model-label-3').text(models[n - 1].labels[2]);
        $('#model-label-4').text(models[n - 1].labels[3]);
    }

    setModel(1);

    $.event.trigger('palette-changed', [wheel.palette]);
});