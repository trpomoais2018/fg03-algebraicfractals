var FractalType = '';
var Coloring = '';
var IterationNumber;
var ConstJulia = { x: 0, y: 0 };
var Scale = 2;
var Center = { x: 0, y: 0 };
var Border = { left: -2, top: -2, right: 2, bottom: 2 };

function setBorder() {
    Border.left = Center.x - Scale;
    Border.right = Center.x + Scale;
    Border.top = Center.y - Scale;
    Border.bottom = Center.y + Scale;
}

function start() {
    IterationNumber = parseInt(document.getElementById("iterationNumber").value);
    ConstJulia.x = parseFloat(document.getElementById("x").value);
    ConstJulia.y = parseFloat(document.getElementById("y").value);
    FractalType = Form.fractal.options[Form.fractal.selectedIndex].value;
    Coloring = Form.color.options[Form.color.selectedIndex].value;
    setBorder();
    draw();
}

function draw() {
    var canvas = document.getElementById("canvas");
    var sky = canvas.getContext('2d');
    var canvasHeight = parseInt(canvas.getAttribute("height"));
    var canvasWidth = parseInt(canvas.getAttribute("width"));
    var image = sky.createImageData(canvasWidth, canvasHeight);
    for (var x = 0; x < canvasWidth; x++) {
        for (var y = 0; y < canvasHeight; y++) {
            var point = ConvertToRealCoordinates(x, y, canvasWidth, canvasHeight);
            var attractor = chooseAttractor(point);
            var color = chooseColor(attractor);
            image.data[4 * (x + canvasWidth * y) + 0] = color[0];
            image.data[4 * (x + canvasWidth * y) + 1] = color[1];
            image.data[4 * (x + canvasWidth * y) + 2] = color[2];
            image.data[4 * (x + canvasWidth * y) + 3] = color[3];
        }
    }
    sky.putImageData(image, 0, 0);
}

function refresh() {
    Center.x = 0;
    Center.y = 0;
    Scale = 2;
}

function ConvertToRealCoordinates(i, j, width, height) {
    var X = Border.left + i * (Border.right - Border.left) / (width - 1);
    var Y = Border.top + j * (Border.bottom - Border.top) / (height - 1);
    return {
        x: X,
        y: Y
    };
}

function chooseAttractor(point) {
    switch (FractalType) {
        case 'newtonPool':
            return getNewtonPool(point, IterationNumber, 0);
        case 'juliaSet':
            return getMandelbrotSet(point);
        case 'mandelbrotSet':
            return getJuliaSet(point);
    }
}

function getNewtonPool(point, n, iterationCount) {
    var sin60 = Math.sin(Math.PI / 3);
    var cos60 = Math.cos(Math.PI / 3);
    if (n === 0)
        return { attr: 0, iter: iterationCount };
    if (checkLimit(point.x, point.y, 1, 0))
        return { attr: 1, iter: iterationCount };
    if (checkLimit(point.x, point.y, -cos60, sin60))
        return { attr: 2, iter: iterationCount };
    if (checkLimit(point.x, point.y, -cos60, -sin60))
        return { attr: 3, iter: iterationCount };
    var x = point.x * point.x;
    var y = point.y * point.y;
    var newX = 2 * point.x / 3 + (x - y) / (3 * (x + y) * (x + y));
    var newY = 2 * point.y * (1 - point.x / Math.pow((x + y), 2)) / 3;
    var newP = { x: newX, y: newY };
    return getNewtonPool(newP, n - 1, iterationCount + 1);
}

function checkLimit(startX, startY, endX, endY) {
    var eps = 0.0001;
    var deltaX = Math.abs(startX - endX);
    var deltaY = Math.abs(startY - endY);
    return deltaX <= eps && deltaY <= eps;
}

function getJuliaSet(point) {
    var x = point.x;
    var y = point.y;
    var x1 = 0;
    var y1 = 0;
    var k = 0;
    while (k < IterationNumber) {
        if (x * x + y * y > 4)
            return i;
        x1 = x * x - y * y + ConstJulia.x;
        y1 = 2 * x * y + ConstJulia.y;
        x = x1;
        y = y1;
        k++;
    }
    return 0;
}

function getMandelbrotSet(point) {
    var x = point.x;
    var y = point.y;
    var x1 = 0;
    var y1 = 0;
    var k = 0;
    while (k < IterationNumber) {
        if (x * x + y * y > 4)
            return k;
        x1 = x * x - y * y + point.x;
        y1 = 2 * x * y + point.y;
        x = x1;
        y = y1;
        k++;
    }
    return 0;
}

function chooseColor(attractor) {
    switch (Coloring) {
        case 'classicColor':
            return getClassicColor(attractor);
        case 'levelColor':
            return getLevelColor(attractor);
        case 'zebraColor':
            return getZebraColor(attractor);
        case 'hybritColor':
            return getHybritColor(attractor);
    }
}

function getClassicColor(attractor) {
    if (FractalType === 'newtonPool') {
        switch (attractor.attr) {
            case 0:
                return [0, 0, 0, 0];
            case 1:
                return [255, 0, 0, 255];
            case 2:
                return [0, 255, 0, 255];
            case 3:
                return [0, 0, 255, 255];
        }
    }
    else {
        if (attractor === 0)
            return [0, 0, 0, 255];
        return [255, 255, 255, 255];
    }
}

function getLevelColor(attractor) {
    if (FractalType === 'newtonPool') 
        var currentIt = attractor.iter;
    else 
        var currentIt = attractor;
    var bright = 255;
    if (IterationNumber > 1)
        bright = bright * currentIt * 4 / (IterationNumber - 1);
    return [bright, bright, bright, bright];

}

function getZebraColor(attractor) {
    if (FractalType === 'newtonPool')
        var currentIt = attractor.iter;
    else
        var currentIt = attractor;
    if (currentIt % 2 === 0)
        return [0, 0, 0, 255];
    return [255, 255, 255, 255];
}

function getHybritColor(attractor) {
    var bright = 255;
    if (IterationNumber > 1)
        bright = bright * attractor.iter / (IterationNumber - 1);
    else
        bright = 0;
    switch (attractor.attr) {
        case 0:
            return [0, 0, 0, 255];
        case 1:
            return [255 + bright, 0 + bright, 0 + bright, 255];
        case 2:
            return [0 + bright, 255 + bright, 0 + bright, 255];
        case 3:
            return [0 + bright, 0 + bright, 255 + bright, 255];
    }
}

function mouseDownHandler(canvas, e) {
    var сoords = canvas.relMouseCoords(e);
    var i = сoords.x * (Border.right - Border.left) / (canvas.width - 1) + Border.left;
    var j = сoords.y * (Border.bottom - Border.top) / (canvas.height - 1) + Border.top;
    if (e.button === 0) 
        Scale /= 1.5;
    if (e.button === 2) 
        Scale *= 1.5;
    Center.x = i;
    Center.y = j;
    start();
}

function mousePress() {
    canvas.addEventListener("mousedown",
        function (e) {
            mouseDownHandler(canvas, e);
        },
        false);
}