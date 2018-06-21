let coords = { left: 0, top: 0, right: 0, bottom: 0 };
let currentFractal = '';
let currentPaint = '';
let scale = 0;

function init(centerX, centerY, type) {
    if (type === undefined)
        type = currentFractal;
    currentFractal = type;
    let left = centerX - scale;
    let top = centerY - scale;
    let right = centerX + scale;
    let bottom = centerY + scale;
    let n = parseInt(document.getElementById('n').value);
    drawFractal(left, top, right, bottom, type, n);
}

function drawFractal(left, top, right, bottom, type, n) {
    coords.left = left;
    coords.right = right;
    coords.top = top;
    coords.bottom = bottom;
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext('2d');
    let height = parseInt(canvas.getAttribute("height"));
    let width = parseInt(canvas.getAttribute("width"));
    let image = context.getImageData(0, 0, width, height);
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let i = x * (right - left) / (width - 1) + left;
            let j = y * (bottom - top) / (height - 1) + top;
            let fractal = chooseFractal(i, j, n, type);
            let paint = choosePaint(fractal, n);
            image.data[4 * (x + y * width) + 0] = paint[0];
            image.data[4 * (x + y * width) + 1] = paint[1];
            image.data[4 * (x + y * width) + 2] = paint[2];
            image.data[4 * (x + y * width) + 3] = paint[3];
        }
    }
    context.putImageData(image, 0, 0);
}

function chooseFractal(i, j, n, type) {
    let re = parseFloat(document.getElementById('re').value);
    let im = parseFloat(document.getElementById('im').value);
    switch (type) {
        case 'newtonPool':
            return newtonPool(i, j, n, 0);
        case 'mandelbrotSet':
            return mandelbrotSet(i, j, n);
        case 'juliaSet':
            return juliaSet(i, j, re, im, n);
    }
}

function choosePaint(fractal, n) {
    switch (currentPaint) {
        case 'classical':
            return paintClassical(fractal, currentFractal);
        case 'levels':
            return paintLevels(n, fractal.iterationAmount);
        case 'zebra':
            return paintZebra(fractal.iterationAmount);
        case 'hybrid':
            return paintHybrid(n, fractal, fractal.iterationAmount); 
    }
}

function changePaint(paint) {
    currentPaint = paint;
    init(0, 0, currentFractal);
}

function paintClassical(point, type) {
    if (type === "newtonPool") {
        switch (point.attractor) {
            case 0:
                return [255, 255, 255, 255];
            case 1:
                return [255, 0, 0, 255];
            case 2:
                return [0, 255, 0, 255];
            case 3:
                return [0, 0, 255, 255];
        }
    } else
        if (point.iterationAmount === 0)
            return [0, 0, 0, 255];
        else
            return [255, 255, 255, 255];
}

function paintHybrid(n, point, iterationAmount) {
    let alpha = n > 1 ? 255 * iterationAmount / (n - 1) : 0;
        switch(point.attractor) {
            case 0:
                return [0, 0, 0, 255];
            case 1:
                return [255 + alpha, 0 + alpha, 0 + alpha, 255];
            case 2:
                return [0 + alpha, 255 + alpha, 0 + alpha, 255];
            case 3:
                return [0 + alpha, 0 + alpha, 255 + alpha, 255];
        }
}

function paintLevels(n, iterationAmount) {
    if (n > 1)
        brightness = 255 * iterationAmount * 4 / (n - 1);
    else
        brightness = 255;
    return [brightness, brightness, brightness, 255];
}

function paintZebra(iterationAmount) {
    if (iterationAmount % 2 === 0)
        return [0, 0, 0, 255];
    else
        return [255, 255, 255, 255];
}

function checkLimit(x1, y1, x2, y2) {
    let deltaX = Math.abs(x2 - x1);
    let deltaY = Math.abs(y2 - y1);
    let eps = 0.0001;
    return deltaX <= eps && deltaY <= eps;
}

function newtonPool(i, j, n, iterationAmount) {
    let cos60 = Math.cos(Math.PI / 3);
    let sin60 = Math.sin(Math.PI / 3);

    if (n === 0)
        return { attractor: 0, iterationAmount: iterationAmount };
    if (checkLimit(i, j, 1, 0))
        return { attractor: 1, iterationAmount: iterationAmount };
    if (checkLimit(i, j, -cos60, sin60))
        return { attractor: 2, iterationAmount: iterationAmount };
    if (checkLimit(i, j, -cos60, -sin60))
        return { attractor: 3, iterationAmount: iterationAmount };
    let i2 = i * i;
    let j2 = j * j;
    let i1 = 2 / 3 * i + (i2 - j2) / (3 * Math.pow((i2 + j2), 2));
    let j1 = 2 / 3 * j * (1 - i / Math.pow((i2 + j2), 2));
    return newtonPool(i1, j1, n - 1, iterationAmount + 1);
}

function mandelbrotSet(i, j, n) {
    let i0 = 0;
    let j0 = 0;
    let i1 = 0;
    let j1 = 0;
    let k = 0;
    while (k < n) {
        i1 = i0 * i0 - j0 * j0 + i;
        j1 = 2 * i0 * j0 + j;
        if (i1 * i1 + j1 * j1 > 4)
            return { iterationAmount: k };
        i0 = i1;
        j0 = j1;
        k++;
    }
    return { iterationAmount: 0 };
}

function juliaSet(i, j, re, im, n) {
    let i0 = i;
    let j0 = j;
    let i1 = 0;
    let j1 = 0;
    let k = 0;
    while (k < n) {
        if (i0 * i0 + j0 * j0 > 4)
            return { iterationAmount: k };
        i1 = i0 * i0 - j0 * j0 + re;
        j1 = 2 * i0 * j0 + im;
        i0 = i1;
        j0 = j1;
        k++;
    }
    return { iterationAmount: 0 };
}

function mouseDownHandler(canvas, e) {
    let mousePosition = canvas.relMouseCoords(e);
    let i = mousePosition.x * (coords.right - coords.left) / (canvas.width - 1) + coords.left;
    let j = mousePosition.y * (coords.bottom - coords.top) / (canvas.height - 1) + coords.top;
    scale = e.button === 0 ? scale / 1.5 : scale * 1.5;
    init(i, j, currentFractal);
}

function mousePress() {
    canvas.addEventListener("mousedown",
        function (e) {
            mouseDownHandler(canvas, e);
        },
        false);
}

function resetScale() {
    scale = 2;
}