let Scale = 3;
let Field = {
    left: -3,
    top: -3,
    right: 3,
    bottom: 3
};
let Fractal = 'newtonPool';
let Coloring = 'classic';

var resetScale = () => {
    Scale = 3;
};

function reCoord(left, top, right, bottom) {
    Field.left = left;
    Field.right = right;
    Field.top = top;
    Field.bottom = bottom;
}

function zoomL(canvas, e) {
    var mouseCoords = canvas.relMouseCoords(e);
    var x = mouseCoords.x * (Field.right - Field.left) / (canvas.width - 1) + Field.left;
    var y = mouseCoords.y * (Field.bottom - Field.top) / (canvas.height - 1) + Field.top;
    if (e.button === 0) {
        Scale /= 1.5;
    }
    if (e.button === 2) {
        Scale *= 1.5;
    }
    run(x, y, Fractal);
}

function pressM() {
    canvas.addEventListener("mousedown",
        function (e) {
            zoomL(canvas, e);
        },
        false);
}

function run(centerX, centerY, fractalType) {
    if (fractalType === undefined)
        fractalType = Fractal;
    Fractal = fractalType;
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    var left = centerX - Scale;
    var top = centerY - Scale;
    var right = centerX + Scale;
    var bottom = centerY + Scale;
    var n = parseInt(document.getElementById('n').value);
    drawFractal(left, top, right, bottom, fractalType, n);
}

function putColor(x, y, color, width, imageData) {
    var index = (x + y * width) * 4;
    imageData.data[index + 0] = color[0];
    imageData.data[index + 1] = color[1];
    imageData.data[index + 2] = color[2];
    imageData.data[index + 3] = color[3];
}

function drawFractal(left, top, right, bottom, fractalType, n) {
    reCoord(left, top, right, bottom);
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var width = canvas.width;
    var height = canvas.height;

    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var i = x * (right - left) / (width - 1) + left;
            var j = y * (bottom - top) / (height - 1) + top;
            var pointData = choseFractal(i, j, n, fractalType);
            var color = choseColor(pointData, n);
            putColor(x, y, color, width, imageData);
        }
    }
    context.putImageData(imageData, 0, 0);
}

function choseFractal(x, y, n, fractalType) {
    switch (fractalType) {
        case 'newtonPool':
            return getNewtonAttr(x, y, n, 0);
        case 'mandelbrotSet':
            return getMandelbrotAttr(x, y, n);
        case 'juliaSet':
            var re = parseFloat(document.getElementById('re').value);
    		var im = parseFloat(document.getElementById('im').value);
            return getJuliaAttr(x, y, re, im, n);
    }
}

function getNewtonAttr(x, y, n, itter) {
    var cos = Math.cos(Math.PI / 3);
    var sin = Math.sin(Math.PI / 3);

    if (n === 0)
        return {
            attractor: 0,
            itterations: itter
        };
    if (checkLimits(x, y, 1, 0))
        return {
            attractor: 1,
            itterations: itter
        };
    if (checkLimits(x, y, -cos, sin))
        return {
            attractor: 2,
            itterations: itter
        };
    if (checkLimits(x, y, -cos, -sin))
        return {
            attractor: 3,
            itterations: itter
        };
    var x2 = x * x;
    var y2 = y * y;
    var x1 = 2 / 3 * x + (x2 - y2) / (3 * (x2 + y2) * (x2 + y2));
    var y1 = 2 / 3 * y * (1 - x / ((x2 + y2) * (x2 + y2)));
    return getNewtonAttr(x1, y1, n - 1, itter + 1);
}

function checkLimits(x1, y1, x2, y2) {
    return Math.abs(x2 - x1) <= 0.0001 && Math.abs(y2 - y1) <= 0.0001;
}

function getMandelbrotAttr(x, y, n) {
    var x0 = 0;
    var y0 = 0;
    var x1 = 0;
    var y1 = 0;
    var k = 0;
    while (k < n) {
        x1 = x0 * x0 - y0 * y0 + x;
        y1 = 2 * x0 * y0 + y;
        if (x1 * x1 + y1 * y1 > 4)
            return {
                itterations: k
            };
        x0 = x1;
        y0 = y1;
        k++;
    }
    return {
        itterations: 0
    };
}

function getJuliaAttr(x, y, re, im, n) {
    var x0 = x;
    var y0 = y;
    var x1 = 0;
    var y1 = 0;
    var k = 0;
    while (k < n) {
        if (x0 * x0 + y0 * y0 > 4)
            return {
                itterations: k
            };
        x1 = x0 * x0 - y0 * y0 + re;
        y1 = 2 * x0 * y0 + im;
        x0 = x1;
        y0 = y1;
        k++;
    }
    return {
        itterations: 0
    };
}

function paintClassic(point, fractalType) {
    if (fractalType === "newtonPool") {
        switch (point.attractor) {
            case 0:
                return [0, 0, 0, 0];
            case 1:
                return [255, 0, 0, 255];
            case 2:
                return [0, 255, 0, 255];
            case 3:
                return [0, 0, 255, 255];
        }
    } else return point.itterations === 0 ? [0, 0, 0, 255] : [255, 255, 255, 255];
}

function paintLevels(n, itter) {
    var brightness = n > 1 ? 255 * itter * 4 / (n - 1) : 255;
    return [brightness, brightness, brightness, 255];
}

function paintZebra(itter) {
    var color;
    itter % 2 === 0 ? color = [0, 0, 0, 255] : color = [255, 255, 255, 255];
    return color;
}

function changeColor(color) {
	resetScale();
    Coloring = color;
    run(0, 0, Fractal);
}

function choseColor(pointData, n) {
    switch (Coloring) {
        case 'classic':
            return paintClassic(pointData, Fractal);
        case 'levels':
            return paintLevels(n, pointData.itterations);
        case 'zebra':
            return paintZebra(pointData.itterations);
    }
}